from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to local dev server...")
        page.goto("http://localhost:3001")

        # Wait for app
        page.wait_for_selector('text=Branding Content Testing', timeout=30000)

        # Take screenshot
        os.makedirs("/home/jules/verification", exist_ok=True)
        page.screenshot(path="/home/jules/verification/final_ui.png", full_page=True)
        print("Screenshot saved.")

        browser.close()

if __name__ == "__main__":
    run()
