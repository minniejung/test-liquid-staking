# 💫 Liquid Staking System with Reward Token (SCOB)

🐱 ETH 기반의 Liquid Staking 스마트 컨트랙트 \
🐱 User는 ETH를 스테이킹하고, 예치 기간에 비례하여 Reward Token (SCOB)을 자동으로 지급받을 수 있음


---


## Contracts

### 1. `ScobyToken.sol`

🐱 ERC20 베이스의 보상 토큰(SCOB)

- `ERC20`, `ERC20Burnable`, `Ownable` 기능 포함
- MAX_SUPPLY : 2,000,000 SCOB
- Initial supply : 1,000,000 SCOB (배포자에게 지급)

#### 🐱 functions

- `mint(address to, uint256 amount)`  :  소유자만 호출 가능, MAX_SUPPLY를 초과하지 않는 범위에서 토큰 발행 \
- `burn(uint256 amount)`  :  사용자가 자신의 토큰을 소각할 수 있음 (just in case)


---


### 2. `LiquidStaking.sol`

🐱 ETH를 스테이킹하면 보상 토큰을 받을 수 있는 스테이킹 컨트랙트

- 연 10% APR
- 보상은 수동 `claim` 또는 `unstake` 시 지급
- 7일 락업 타이머 (`lastClaimed + 7 days`)

#### ⛽ 리워드 공식
- `reward = (stakedAmount × REWARD_RATE × timeElapsed) / (100 × SECONDS_IN_YEAR)`


---


### 2-1. functions

### 🔧 Setter

- `stake()`
  - 사용자가 ETH를 예치합니다 (`msg.value`)
  - 기존 리워드가 있다면 자동으로 SCOB 보상을 청구합니다

- `unstake(uint256 amount)`
  - 사용자가 지정한 만큼 ETH를 출금합니다
  - 출금 전에 보상이 자동 청구됩니다
 
- `claimRewards()`
  - 현재까지 누적된 보상을 수동으로 SCOB로 청구합니다

### 🔍 Getter

- `getPendingRewards(address user)`
  - 사용자가 지금 `claimRewards()`를 호출하면 받을 수 있는 SCOB 양
  - return type : `uint256` (단위: wei)

- `getStakedAmount(address user)`
  - 사용자의 현재 스테이킹된 ETH 양
  - return type : `uint256` (단위: wei)

- `getUnlockTime(address user)`
  - 마지막 리워드 청구 시점 기준, 보상이 언락되는 시각 (7일 후)
  - return type : `uint256` (Unix timestamp)

- `isUnlocked(address user)`
  - 현재 시각이 언락 타임을 지났는지 여부
  - return type : `bool`

- `contractBalance()`
  - 현재 컨트랙트가 보유 중인 ETH 총액
  - return type : `uint256` (단위: wei)

- `getTVL()`
  - 현재 스테이킹된 ETH 총합 (Total Value Locked)
  - return type : `uint256` (단위: wei)

---


## Testing

```bash
npm run test (npx tsx scripts/testStaking.ts) // console test
npx hardhat test // chai
