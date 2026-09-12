#!/usr/bin/env python3
"""Local URL inspection helper for the SME Phishing Defense Toolkit.

This tool is OPTIONAL and ADVANCED. The toolkit is fully usable without it.
The web interface never calls it and never contacts a URL by itself.

What it does:
    sends a HEAD request from your own machine, follows a small number of
    redirects, and reports the chain, the final status and TLS certificate
    metadata.

What it does NOT do:
    execute JavaScript, render pages, send cookies, download page bodies,
    download executable content, or open anything in a browser.

Read this before using it:
    contacting a suspicious address makes your public IP address visible to
    whoever controls it. That tells an attacker the message was read and
    reveals roughly where the reader is. During an incident it can also
    disturb evidence. Prefer the passive analysis in the web interface, and
    use this only when you have a reason to reach the site and accept that.

Requires Python 3.8 or later. No third party packages.

Usage:
    python3 local-url-helper.py https://example.com/path
    python3 local-url-helper.py --json https://example.com/path
    python3 local-url-helper.py --allow-private http://192.168.1.1/
"""

import argparse
import ipaddress
import json
import socket
import ssl
import sys
from http.client import HTTPConnection, HTTPSConnection
from urllib.parse import urlparse, urlunparse, urljoin

ALLOWED_SCHEMES = ("http", "https")
DEFAULT_TIMEOUT = 6.0
DEFAULT_MAX_REDIRECTS = 5
USER_AGENT = "SME-Phishing-Defense-Toolkit/1.0 (URL inspection, HEAD only)"

# Content types that are never fetched beyond their headers.
EXECUTABLE_TYPES = (
    "application/x-msdownload",
    "application/x-executable",
    "application/x-dosexec",
    "application/vnd.microsoft.portable-executable",
    "application/x-msi",
    "application/java-archive",
    "application/x-apple-diskimage",
    "application/vnd.android.package-archive",
)


class InspectionError(Exception):
    """Raised when a URL cannot be inspected safely."""


def parse_target(raw):
    """Validate a URL and reject every scheme other than http and https."""
    parsed = urlparse(raw.strip())
    if not parsed.scheme:
        raise InspectionError(
            "The address has no scheme. Write it in full, for example https://example.com/"
        )
    if parsed.scheme.lower() not in ALLOWED_SCHEMES:
        raise InspectionError(
            "Refusing scheme '%s'. Only http and https are inspected. "
            "Schemes such as file, data, javascript and ftp are never opened."
            % parsed.scheme
        )
    if not parsed.hostname:
        raise InspectionError("The address has no host name.")
    return parsed


def resolve_addresses(host, port):
    """Resolve a host to every address it maps to."""
    try:
        infos = socket.getaddrinfo(host, port, proto=socket.IPPROTO_TCP)
    except socket.gaierror as exc:
        raise InspectionError("The name '%s' could not be resolved: %s" % (host, exc))
    seen = []
    for info in infos:
        address = info[4][0]
        if address not in seen:
            seen.append(address)
    return seen


def classify_address(address):
    """Return a reason string when an address is not a public one."""
    try:
        ip = ipaddress.ip_address(address)
    except ValueError:
        return "not a valid IP address"
    if ip.is_loopback:
        return "loopback"
    if ip.is_private:
        return "private range"
    if ip.is_link_local:
        return "link local"
    if ip.is_reserved:
        return "reserved"
    if ip.is_multicast:
        return "multicast"
    if ip.is_unspecified:
        return "unspecified"
    return None


def guard_addresses(host, port, allow_private):
    """Block internal targets unless the operator explicitly allows them.

    This check runs again for every redirect hop, because a public first hop
    can redirect to an internal address.
    """
    addresses = resolve_addresses(host, port)
    blocked = []
    for address in addresses:
        reason = classify_address(address)
        if reason:
            blocked.append((address, reason))
    if blocked and not allow_private:
        details = ", ".join("%s (%s)" % item for item in blocked)
        raise InspectionError(
            "Refusing to contact %s: it resolves to %s. "
            "Pass --allow-private only if you are deliberately testing an internal host."
            % (host, details)
        )
    return addresses


def tls_metadata(host, port, timeout):
    """Collect certificate metadata without trusting the result blindly."""
    context = ssl.create_default_context()
    info = {"verified": True, "error": None}
    try:
        with socket.create_connection((host, port), timeout=timeout) as raw_sock:
            with context.wrap_socket(raw_sock, server_hostname=host) as tls_sock:
                cert = tls_sock.getpeercert()
                info["protocol"] = tls_sock.version()
                info["cipher"] = tls_sock.cipher()[0] if tls_sock.cipher() else None
    except ssl.SSLCertVerificationError as exc:
        info["verified"] = False
        info["error"] = str(exc)
        cert = None
    except (ssl.SSLError, socket.timeout, OSError) as exc:
        return {"verified": False, "error": str(exc)}

    if cert:
        subject = dict(item for group in cert.get("subject", ()) for item in group)
        issuer = dict(item for group in cert.get("issuer", ()) for item in group)
        info["subject_common_name"] = subject.get("commonName")
        info["issuer_common_name"] = issuer.get("commonName")
        info["issuer_organization"] = issuer.get("organizationName")
        info["not_before"] = cert.get("notBefore")
        info["not_after"] = cert.get("notAfter")
        names = [value for key, value in cert.get("subjectAltName", ()) if key == "DNS"]
        info["subject_alt_names"] = names[:12]
        info["subject_alt_name_count"] = len(names)
    return info


def request_head(parsed, timeout, allow_private):
    """Send a single HEAD request and return the status and headers."""
    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    addresses = guard_addresses(parsed.hostname, port, allow_private)

    path = parsed.path or "/"
    if parsed.query:
        path = path + "?" + parsed.query

    if parsed.scheme == "https":
        context = ssl.create_default_context()
        connection = HTTPSConnection(
            parsed.hostname, port, timeout=timeout, context=context
        )
    else:
        connection = HTTPConnection(parsed.hostname, port, timeout=timeout)

    try:
        # No cookie header is ever sent. Nothing is stored between requests.
        connection.request(
            "HEAD",
            path,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "*/*",
                "Connection": "close",
            },
        )
        response = connection.getresponse()
        headers = {key.lower(): value for key, value in response.getheaders()}
        return {
            "status": response.status,
            "reason": response.reason,
            "headers": headers,
            "addresses": addresses,
        }
    except ssl.SSLCertVerificationError as exc:
        raise InspectionError("TLS certificate verification failed: %s" % exc)
    except (socket.timeout, TimeoutError):
        raise InspectionError("The request timed out after %.1f seconds." % timeout)
    except OSError as exc:
        raise InspectionError("The connection failed: %s" % exc)
    finally:
        connection.close()


def inspect(url, timeout, max_redirects, allow_private):
    """Follow the redirect chain with HEAD requests only."""
    chain = []
    current = url
    for hop in range(max_redirects + 1):
        parsed = parse_target(current)
        result = request_head(parsed, timeout, allow_private)

        entry = {
            "url": urlunparse(parsed),
            "status": result["status"],
            "reason": result["reason"],
            "addresses": result["addresses"],
            "content_type": result["headers"].get("content-type"),
            "content_length": result["headers"].get("content-length"),
            "server": result["headers"].get("server"),
        }
        if parsed.scheme == "https":
            entry["tls"] = tls_metadata(
                parsed.hostname, parsed.port or 443, timeout
            )
        chain.append(entry)

        content_type = (entry["content_type"] or "").split(";")[0].strip().lower()
        if content_type in EXECUTABLE_TYPES:
            entry["note"] = (
                "The destination declares executable content. "
                "Nothing was downloaded."
            )
            break

        location = result["headers"].get("location")
        if result["status"] in (301, 302, 303, 307, 308) and location:
            if hop == max_redirects:
                entry["note"] = (
                    "Redirect limit of %d reached. The chain continues beyond this point."
                    % max_redirects
                )
                break
            current = urljoin(entry["url"], location)
            entry["redirects_to"] = current
            continue
        break

    return chain


def print_report(chain):
    print()
    print("Redirect chain")
    print("=" * 60)
    for index, entry in enumerate(chain, start=1):
        print("%d. %s" % (index, entry["url"]))
        print("   status         : %s %s" % (entry["status"], entry["reason"]))
        print("   resolves to    : %s" % ", ".join(entry["addresses"]))
        if entry.get("content_type"):
            print("   content type   : %s" % entry["content_type"])
        if entry.get("server"):
            print("   server         : %s" % entry["server"])
        tls = entry.get("tls")
        if tls:
            if tls.get("verified"):
                print("   tls            : %s, issuer %s" % (
                    tls.get("protocol") or "unknown",
                    tls.get("issuer_common_name") or tls.get("issuer_organization") or "unknown",
                ))
                print("   certificate for: %s" % (tls.get("subject_common_name") or "not stated"))
                print("   valid until    : %s" % (tls.get("not_after") or "unknown"))
                if tls.get("subject_alt_name_count"):
                    print("   alt names      : %d, first: %s" % (
                        tls["subject_alt_name_count"],
                        ", ".join(tls.get("subject_alt_names", [])[:4]),
                    ))
            else:
                print("   tls            : NOT VERIFIED, %s" % tls.get("error"))
        if entry.get("redirects_to"):
            print("   redirects to   : %s" % entry["redirects_to"])
        if entry.get("note"):
            print("   note           : %s" % entry["note"])
        print()

    final = chain[-1]
    print("Final destination: %s" % final["url"])
    print("Final status     : %s %s" % (final["status"], final["reason"]))
    print()
    print("A status and a valid certificate say nothing about whether the site")
    print("is honest. A fraudulent page can hold a perfectly valid certificate.")


def main():
    parser = argparse.ArgumentParser(
        description="Inspect a URL with HEAD requests only. Optional companion "
                    "to the SME Phishing Defense Toolkit."
    )
    parser.add_argument("url", help="The address to inspect. http and https only.")
    parser.add_argument("--timeout", type=float, default=DEFAULT_TIMEOUT,
                        help="Timeout in seconds per request. Default %.1f." % DEFAULT_TIMEOUT)
    parser.add_argument("--max-redirects", type=int, default=DEFAULT_MAX_REDIRECTS,
                        help="Maximum redirects to follow. Default %d." % DEFAULT_MAX_REDIRECTS)
    parser.add_argument("--allow-private", action="store_true",
                        help="Permit loopback, private and reserved addresses. Off by default.")
    parser.add_argument("--json", action="store_true", help="Print the result as JSON.")
    parser.add_argument("--yes", action="store_true",
                        help="Skip the confirmation prompt. Use only in scripts you control.")
    args = parser.parse_args()

    if args.max_redirects < 0 or args.max_redirects > 10:
        print("The redirect limit must be between 0 and 10.", file=sys.stderr)
        return 2

    if not args.yes:
        print("This will contact the address from this machine.")
        print("The site will see your public IP address and will learn that the")
        print("message was read. Do not do this if evidence must stay untouched.")
        try:
            answer = input("Continue? Type yes to proceed: ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            print()
            return 1
        if answer not in ("yes", "y", "da", "да"):
            print("Cancelled. Nothing was sent.")
            return 1

    try:
        chain = inspect(args.url, args.timeout, args.max_redirects, args.allow_private)
    except InspectionError as exc:
        if args.json:
            print(json.dumps({"error": str(exc)}, indent=2, ensure_ascii=False))
        else:
            print("Cannot inspect this address: %s" % exc, file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps({"chain": chain}, indent=2, ensure_ascii=False))
    else:
        print_report(chain)
    return 0


if __name__ == "__main__":
    sys.exit(main())
