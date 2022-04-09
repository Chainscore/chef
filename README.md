# Sushi Chef Subgraph

```
{
  users {
    id
    pools(where: {amount_gt: 0}) {
      id
      amount
      pool {
        id
        sushiRewarder {
          rewarder {
            rewardPerPoint
            rewardToken
          }
        }
        tokenRewarder {
          rewarder {
            rewardPerPoint
            rewardToken
          }
        }
      }
    }
  }
}
```