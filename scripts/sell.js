const INFURA_KEY = process.env.INFURA_KEY
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS
const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const NETWORK = process.env.NETWORK
const API_KEY = process.env.API_KEY

const TOKEN_ID = "1";

const DUTCH_AUCTION_OPTION_ID = "1";
const DUTCH_AUCTION_START_AMOUNT = 100;
const DUTCH_AUCTION_END_AMOUNT = 50;    
const NUM_DUTCH_AUCTIONS = 5;
const FIXED_PRICE_OPTION_ID = "2";
const NUM_FIXED_PRICE_AUCTIONS = 10;
const FIXED_PRICE = 100;

if (!MNEMONIC || !INFURA_KEY || !NETWORK || !OWNER_ADDRESS || !FACTORY_CONTRACT_ADDRESS || !API_KEY || !NFT_CONTRACT_ADDRESS) {
    console.error("Please set a mnemonic, infura key, owner, network, API key, nft contract, and factory contract address.")
    return
}

async function main() {

    // Example: simple sale of an item owned by a user. 
    console.log("Auctioning an item...")
    const sellOrder = await seaport.createSellOrder({
        tokenId: TOKEN_ID,
        tokenAddress: NFT_CONTRACT_ADDRESS,
        startAmount: FIXED_PRICE,
        expirationTime: 0
    })    
    console.log(`Successfully created a sell order! ${sellOrder.asset.openseaLink}\n`)

    // Example: many fixed price auctions from a factory.
    console.log("Creating fixed price auctions...")
    const fixedSellOrders = await seaport.createFactorySellOrders({
        assetId: FIXED_PRICE_OPTION_ID,
        factoryAddress: FACTORY_CONTRACT_ADDRESS,
        accountAddress: OWNER_ADDRESS,
        startAmount: FIXED_PRICE,
        numberOfOrders: NUM_FIXED_PRICE_AUCTIONS
    })
    console.log(`Successfully made ${fixedSellOrders.length} fixed-price sell orders! ${fixedSellOrders[0].asset.openseaLink}\n`)

    // Example: many declining Dutch auction from a factory.
    console.log("Creating dutch auctions...")
    // Expire one day from now
    const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)
    const dutchSellOrders = await seaport.createFactorySellOrders({
        assetId: DUTCH_AUCTION_OPTION_ID,
        factoryAddress: FACTORY_CONTRACT_ADDRESS,
        accountAddress: OWNER_ADDRESS, 
        startAmount: DUTCH_AUCTION_START_AMOUNT,
        endAmount: DUTCH_AUCTION_END_AMOUNT,
        expirationTime: expirationTime,
        numberOfOrders: NUM_DUTCH_AUCTIONS
    })
    console.log(`Successfully made ${dutchSellOrders.length} Dutch-auction sell orders! ${dutchSellOrders[0].asset.openseaLink}\n`)

    // TODO: Incremental prices example.
}

main()