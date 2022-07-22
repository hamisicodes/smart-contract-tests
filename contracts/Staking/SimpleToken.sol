// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleToken is ERC20, Ownable{
    
    constructor() ERC20("MYTOKEN","MT") {
    }

    function viewBalance() public view onlyOwner returns (uint256){
        return address(this).balance;
    }

    function mint(address _to, uint256 _amount) public  {
        _mint(_to, _amount);
    }


}