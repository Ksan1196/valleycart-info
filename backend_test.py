#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class ValleycartAPITester:
    def __init__(self, base_url="https://dynamic-corp-site.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_admin_login(self):
        """Test admin login and get token"""
        print("\n🔐 Testing Admin Authentication...")
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@valleycart.com", "password": "admin123"}
        )
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token received: {self.token[:20]}...")
            return True
        return False

    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.token:
            print("❌ Skipping user info test - no token")
            return False
        
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_content_endpoints(self):
        """Test all content-related endpoints"""
        print("\n📄 Testing Content Management...")
        
        # Test get all content
        success, all_content = self.run_test(
            "Get All Content",
            "GET",
            "content",
            200
        )
        
        if not success:
            return False

        # Test individual page content
        pages = ['home', 'about', 'research', 'impact', 'sustainability', 'brands']
        for page in pages:
            success, page_content = self.run_test(
                f"Get {page.title()} Page Content",
                "GET",
                f"content/{page}",
                200
            )
            if not success:
                return False

        # Test content update (requires authentication)
        if self.token:
            # Get home page content first
            success, home_content = self.run_test(
                "Get Home Content for Update",
                "GET",
                "content/home",
                200
            )
            
            if success and 'sections' in home_content:
                # Update the content
                update_data = {"sections": home_content['sections']}
                success, _ = self.run_test(
                    "Update Home Page Content",
                    "PUT",
                    "content/home",
                    200,
                    data=update_data
                )
                return success
        
        return True

    def test_contact_endpoints(self):
        """Test contact form submission and retrieval"""
        print("\n📧 Testing Contact Form...")
        
        # Test contact form submission
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+91-9876543210",
            "message": "This is a test message from automated testing."
        }
        
        success, response = self.run_test(
            "Submit Contact Form",
            "POST",
            "contact",
            200,
            data=contact_data
        )
        
        if not success:
            return False

        # Test getting contact submissions (requires authentication)
        if self.token:
            success, contacts = self.run_test(
                "Get Contact Submissions",
                "GET",
                "contact",
                200
            )
            return success
        
        return True

    def test_invalid_endpoints(self):
        """Test error handling"""
        print("\n🚫 Testing Error Handling...")
        
        # Test invalid page content
        success, _ = self.run_test(
            "Get Invalid Page Content",
            "GET",
            "content/invalid-page",
            404
        )
        
        # Test invalid login
        success2, _ = self.run_test(
            "Invalid Login",
            "POST",
            "auth/login",
            401,
            data={"email": "invalid@example.com", "password": "wrongpassword"}
        )
        
        return success and success2

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Valleycart Organics API Tests...")
        print(f"   Backend URL: {self.base_url}")
        print("=" * 60)

        # Test admin authentication
        if not self.test_admin_login():
            print("❌ Admin login failed, stopping tests")
            return False

        # Test user info
        self.test_get_current_user()

        # Test content endpoints
        if not self.test_content_endpoints():
            print("❌ Content tests failed")
            return False

        # Test contact endpoints
        if not self.test_contact_endpoints():
            print("❌ Contact tests failed")
            return False

        # Test error handling
        self.test_invalid_endpoints()

        # Print results
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"   Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = ValleycartAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())