
import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3001/")
        page.wait_for_load_state("networkidle")

        # Wait for the generate button to be visible
        page.wait_for_selector('button:has-text("Generate")')

        # Upload an image
        with page.expect_file_chooser() as fc_info:
            page.get_by_role("button", name="New image").click()
        # Create a dummy image file for upload
        with open("jules-scratch/verification/dummy_image.png", "wb") as f:
            f.write(b"dummy image content")
        fc_info.value.set_files("jules-scratch/verification/dummy_image.png")

        # Click the generate button
        page.get_by_role("button", name="Generate").click()

        # Wait for the caption to be generated
        # The caption is in a <pre> tag
        caption_element = page.locator("pre")
        expect(caption_element).to_be_visible(timeout=30000)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

    finally:
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
