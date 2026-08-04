- Route tests are done with supertest. This is done so that i can run routetests without using frontend.
- I considered that to be a better approach than robot tests since robot tests will break very often and easily.

# setup.js

- Runs before every test file. It sets up the docker postgres container for testing.
- This currently runs all tests sequentially rather than concurrently since clearing the images started to break at somepoint.
- Setup is largely AI-coded.

# Actual tests:

- The tests are made specifically for checking the correctness of the routes input to its validation functions and what it returns to the user.
- It does also use a 'realistic' database image that also has some coverage on how that works.
- Validation functionalities are mocked for this. They are covered by unit-tests and i wanted to focus this test on the route itself.
