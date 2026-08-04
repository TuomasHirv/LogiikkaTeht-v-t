# Positive

- Validation engine. Logic validation from user input is very complex. And is the most tested part of the code. (about 2000 lines)
- Test suites running against a real postgres image.
- Frontend loading optimization.
- Deployed and Running

# Improvements.

## TypeScript

- Honestly it seems to be almost necessary to use TypeScript.
- I chose not to use it since I haven't finished the course for it 'yet' and I had to make this with some time constraints.
- example: in my code I had 'lenght' instead of 'length' sitting around unverified. Sometimes i would also have expected values that didn't match returns
- With TypeScript those problems would have been solved a lot sooner.

## Consistent code validation

- In all of my excitement and speed I often made fixes and features that would regress in other ways.
- In fact the best features I made were the opposite of this: validation directory is the opposite of this creating incremental changes that is tested before more is written.
- Fixing bugs should always include new strict test cases that directly test the bug.
- This is also a habit I picked up on later at the same instance as that 'lenght' typo.

## Removing duplicate code

- It is difficult to avoid duplicate code, but having too much of it leads to a load of work further along.
- Example: When adding feedback to login and registration it used the zustand store actions. These are largely the same but I only updated feedback for login not registration. This would have caused register to always fail.
- Another example of this is the answerHelper.js. Removing the duplication from there probably removed about 400 lines of code.

# Looking forward

- If I had to add one thing to this it would be better accessibility. This project doesn't include any labels that could help screen readers and such.
- Consistently building features from individual functions that can be Validated and tested.
- While i did spend the most of this document on weaknesses it is important to note that it was a large piece of work and it's deployed and working.
