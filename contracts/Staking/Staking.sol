// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FreeNFT.sol";
import "./Token.sol";

contract Staking {
    mapping (uint256 => address) private _stakings;
    mapping (uint256 => uint256) private _lastRuns;
    FreeNFT public nft;
    SimpleToken public myToken;
    
    constructor(address _nft, address _token) {
        nft = FreeNFT(_nft);
        myToken = SimpleToken(_token);
    }

    function sendNft(uint256 _token_id) public {
        require(nft.ownerOf(_token_id) == msg.sender, "cannot send the nft");
        require(_stakings[_token_id] == address(0), "already sent");

        _stakings[_token_id] = msg.sender;
        _lastRuns[_token_id] = block.timestamp; 

    }

    function withdrawNft(uint256 _token_id) public {
        require(nft.ownerOf(_token_id) == msg.sender, "cannot withdraw the nft");
        require(_stakings[_token_id] != address(0), "nft unavailable for withdrwal");

        delete _stakings[_token_id];
        delete _lastRuns[_token_id];
    }

    function getStakings(uint256 _token_id) public view returns (address) {
        require(_stakings[_token_id] != address(0), "nft unaivalable");
        return _stakings[_token_id];
    }

    function getLatRuns(uint256 _token_id) public view returns (uint256) {
        return _lastRuns[_token_id];
    }

    function withdrawTokensForNft(uint256 _token_id) external {
        require(nft.ownerOf(_token_id) == msg.sender, "Not owner");
        require(_stakings[_token_id] != address(0), "nft unaivalable");
        require(block.timestamp - _lastRuns[_token_id] >= 24 hours , "Need to wait for 24 hours");

        myToken.mint(msg.sender, 10);

        //set the last run to a new one after withdrawal of rewards
        if (_stakings[_token_id] != address(0)){   
            _lastRuns[_token_id] = block.timestamp;
        }
    }

}