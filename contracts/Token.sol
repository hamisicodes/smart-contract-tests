// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Token is ERC1155("") {
    uint256 public constant ZERO = 0;
    uint256 public constant ONE = 1;
    uint256 public constant TWO = 2;
    uint256 public constant THREE = 3;
    uint256 public constant FOUR = 4;
    uint256 public constant FIVE = 5;
    uint256 public constant SIX = 6;

    struct Minter {
        address addr;
        uint256 lastMint;
    }

    mapping (address => Minter) public _minters;
    mapping (address => bool) public _mintersExists;

    function _mintToken(uint256 token_id, uint256 amount) internal {
        _mint(msg.sender, token_id, amount, "");

    }

    function mintToken(uint256 token_id, uint256 amount) external {
        require(token_id == ZERO || token_id == ONE || token_id == TWO, "cannot mint token");
        
        if (! _mintersExists[msg.sender]){
            _mintToken(token_id, amount);

            _minters[msg.sender] =  Minter(msg.sender, block.timestamp);
            _mintersExists[msg.sender] = true;
        }
        else{
            Minter storage minter = _minters[msg.sender];
            require(block.timestamp - minter.lastMint >= 1 minutes, "1-minute cooldown between mints");

            _mintToken(token_id, amount);
            minter.lastMint = block.timestamp;
        }

    }

    function mintThree(uint256[] memory ids, uint256[] memory amounts) external {
        require(ids.length == amounts.length && amounts.length == 2, "Only 2 tokens can be burned");
        require(ids[0] == ZERO && ids[1] == ONE, "invalid tokens");
        require(amounts[0] == amounts[1], "same amounts required");
        _burnBatch(msg.sender, ids, amounts);
        _mintToken(THREE, amounts[0]);

    }

    function mintFour(uint256[] memory ids, uint256[] memory amounts) external {
        require(ids.length == amounts.length && amounts.length == 2, "Only 2 tokens can be burned");
        require(ids[0] == ONE && ids[1] == TWO, "invalid tokens");
        require(amounts[0] == amounts[1], "same amounts required");
        _burnBatch(msg.sender, ids, amounts);
        _mintToken(FOUR, amounts[0]);

    }

    function mintFive(uint256[] memory ids, uint256[] memory amounts) external {
        require(ids.length == amounts.length && amounts.length == 2, "Only 2 tokens can be burned");
        require(ids[0] == ZERO && ids[1] == TWO, "invalid tokens");
        require(amounts[0] == amounts[1], "same amounts required");
        _burnBatch(msg.sender, ids, amounts);
        _mintToken(FIVE, amounts[0]);

    }

    function mintSix(uint256[] memory ids, uint256[] memory amounts) external {
        require(ids.length == amounts.length && amounts.length == 3, "Only 3 tokens can be burned");
        require(ids[0] == ZERO && ids[1] == ONE && ids[2] == TWO, "invalid tokens");
        require(amounts[0] == amounts[1] && amounts[1] == amounts[2] , "same amounts required");
        _burnBatch(msg.sender, ids, amounts);
        _mintToken(SIX, amounts[0]);

    }

    function burnToken(uint256 token_id, uint256 amount) external {
        require(token_id == FOUR || token_id == FIVE || token_id == SIX, "invalid tokens");
        _burn(msg.sender, token_id, amount);

    }

    function getBalance(uint256 id) public view returns (uint256) {
        return balanceOf(msg.sender, id);
    }

    function tradeToken(uint256 from, uint256 to, uint256 amount) external {
        require(to == 0 || to == 1 || to == 2, "invalid token to trade for");
        uint256 balance = getBalance(from);
        require(amount <= balance, "Not enough balance to trade");

        _burn(msg.sender, from, amount);
        _mintToken(to, amount);
    
    }

}