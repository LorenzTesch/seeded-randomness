# Seeded Randomness - Deterministic Number Generator

Generate a semi-random number based on a string input.

```
const dng = require('./dng');

const value = dng('example_username+post_id', 100, 0); // returns int

const probability = 0.2; // 20%
const shouldPerformAction = value / 100 < probability;

if(shouldPerformAction){
    // press like button...
}
```
Result: Approximately 20% of users are selected to like this post. The selection is deterministic per post, so different posts will have different sets of users liking them.

## Use-case: Stateless User Action Assignment in Web Automation

Imagine you have **100 user accounts** and want **20% of them** to perform a certain action, such as clicking a button or triggering a workflow.  

Instead of storing state in a database (i.e., which users have performed the action), you can generate a **deterministic pseudo-random number** from the user identifier. This allows you to **reproduce the same assignment consistently**, without storing any state.

### How it Works

1. Take the user identifier as input (e.g., `"user_42"`).  
2. Generate a hash from the string.  
3. Map the hash to a pseudo-random number in the range `[0,1]`.  
4. Compare the number to your desired probability threshold (e.g., 0.2 for 20%).  
5. If the number is below the threshold, the user performs the action.