// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FreeNFT is ERC721 {
    uint256 public tokenSupply = 0;
    uint256 public constant MAX_SUPPLY = 10;

    constructor() ERC721("HAMISI-NFT-COLLECTION-1", "HNFT1") {

    }

    function mint() public {
        require(tokenSupply < MAX_SUPPLY, "Supply used up");
        _mint(msg.sender, tokenSupply);
        tokenSupply ++ ;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmTiu77os2ZbiaUBqHSc384e2aqp95xSfL8MbFWZqQtjXm/";
    }

}