import os
import re

legacy_dir = r"c:\Users\anony\OneDrive - Naushad Alam\Desktop\global tools\globaltoolshub\legacy"

def fix_urls():
    fixed_count = 0
    for root, dirs, files in os.walk(legacy_dir):
        for file in files:
            if not file.endswith(".html"): continue
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            original = content
            
            # Fix repeated /legacy/legacy...
            content = re.sub(r'(/legacy)+/', '/legacy/', content)
            
            # Fix usemagictools URL corruptions where "usemagictools" was replaced with "globaltoolshub"
            # We want to replace "/legacy/globaltoolshub/" back to "/legacy/usemagictools/"
            content = content.replace('/legacy/globaltoolshub/', '/legacy/usemagictools/')
            
            # Fix online-tools URL corruptions
            # We want to replace "/legacy/global-tools/" back to "/legacy/online-tools/"
            content = content.replace('/legacy/global-tools/', '/legacy/online-tools/')
            
            # Fix absolute paths that are breaking because of the GitHub Pages subpath
            # For example: href="/favicon.ico" or href="/apple-touch-icon.png"
            # It should be href="../../favicon.ico" or just prefix with /globaltoolshub/
            # BUT the safest and most robust way is to just replace href="/ with href="../../ for tools inside usemagictools.
            # Actually, the user's issue with usemagictools is primarily canonical tags and absolute favicons.
            content = re.sub(r'(href|src)="(/legacy/[^"]+)"', r'\1="/globaltoolshub\2"', content)
            
            # For favicons in legacy/usemagictools/ that point to /favicon.ico
            if "legacy\\usemagictools" in filepath or "legacy/usemagictools" in filepath:
                content = content.replace('href="/favicon', 'href="../../favicon')
                content = content.replace('href="/apple-touch', 'href="../../apple-touch')
                
            if content != original:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                fixed_count += 1
    
    print(f"Fixed {fixed_count} files!")

if __name__ == "__main__":
    fix_urls()
