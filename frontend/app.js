// Contract ABI and Address
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "buyNFT",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getTokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "listNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "mintNFT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "nfts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "forSale",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
            }
        ],
        "name": "NFTMinted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "NFTListed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "NFTSold",
        "type": "event"
    }
];

// Change this to your deployed contract address
const contractAddress = "0x436a5fe44a607caB47dE49C0122e8ADC270e0331"; // Replace with actual contract address

// Global variables
let provider, signer, contract;
let currentAccount = null;
let allNFTs = [];
let currentFilter = 'all';
let currentSearchTerm = '';
let currentSort = 'newest';
let currentPage = 1;
let itemsPerPage = 6;
let totalPages = 1;

// Add these variables for login/signup functionality
let isLoggedIn = false;
let currentUser = null;

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const accountInfoDiv = document.getElementById('accountInfo');
const accountAddressEl = document.getElementById('accountAddress');
const accountBalanceEl = document.getElementById('accountBalance');
const nftImageInput = document.getElementById('nftImage');
const removeImageBtn = document.getElementById('removeImage');
const imagePreviewDiv = document.getElementById('imagePreview');
const previewImg = document.getElementById('preview');
const nftNameInput = document.getElementById('nftName');
const nftDescriptionInput = document.getElementById('nftDescription');
const charCountEl = document.getElementById('charCount');
const nftPriceInput = document.getElementById('nftPrice');
const nftForm = document.querySelector('.nft-form');
const mintNFTBtn = document.getElementById('mintNFT');
const resetFormBtn = document.getElementById('resetForm');
const mintingStatusDiv = document.getElementById('mintingStatus');
const nftGallery = document.getElementById('nftGallery');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchNFT');
const sortSelect = document.getElementById('sortOptions');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageIndicator = document.getElementById('pageIndicator');
const nftModal = document.getElementById('nftModal');
const closeModal = document.querySelector('.close-modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalCreator = document.getElementById('modalCreator');
const modalOwner = document.getElementById('modalOwner');
const modalMintDate = document.getElementById('modalMintDate');
const modalTokenId = document.getElementById('modalTokenId');
const modalStatus = document.getElementById('modalStatus');
const modalPrice = document.getElementById('modalPrice');
const buyOptions = document.getElementById('buyOptions');
const sellOptions = document.getElementById('sellOptions');
const buyNFTBtn = document.getElementById('buyNFT');
const listNFTBtn = document.getElementById('listNFT');
const cancelListingBtn = document.getElementById('cancelListing');
const sellPriceInput = document.getElementById('sellPrice');
const transactionStatus = document.getElementById('transactionStatus');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const shareBtn = document.getElementById('shareBtn');
const transactionList = document.getElementById('transactionList');

// Additional DOM elements for auth
const loginSignupBtn = document.getElementById('loginSignupBtn');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const signupPassword = document.getElementById('signupPassword');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

// New feature: Local image gallery
const localImageGallery = [
    {
        id: 'local-1',
        name: 'Abstract Art',
        thumbnail: 'https://source.unsplash.com/featured/300x300/?abstract',
        fullImage: 'https://source.unsplash.com/featured/1200x1200/?abstract'
    },
    {
        id: 'local-2',
        name: 'Digital Landscape',
        thumbnail: 'https://source.unsplash.com/featured/300x300/?landscape,digital',
        fullImage: 'https://source.unsplash.com/featured/1200x1200/?landscape,digital'
    },
    {
        id: 'local-3',
        name: 'Cyberpunk Portrait',
        thumbnail: 'https://source.unsplash.com/featured/300x300/?portrait,neon',
        fullImage: 'https://source.unsplash.com/featured/1200x1200/?portrait,neon'
    },
    {
        id: 'local-4',
        name: 'Colorful Geometry',
        thumbnail: 'https://source.unsplash.com/featured/300x300/?geometry,colorful',
        fullImage: 'https://source.unsplash.com/featured/1200x1200/?geometry,colorful'
    },
    {
        id: 'local-5',
        name: 'Future City',
        thumbnail: 'https://source.unsplash.com/featured/300x300/?city,futuristic',
        fullImage: 'https://source.unsplash.com/featured/1200x1200/?city,futuristic'
    },
    {
        id: 'local-6',
        name: 'Space Exploration',
        thumbnail: 'https://source.unsplash.com/featured/300x300/?space,planets',
        fullImage: 'https://source.unsplash.com/featured/1200x1200/?space,planets'
    }
];

// Initialize app when page loads
window.addEventListener('DOMContentLoaded', initialize);

// Initialize the application
async function initialize() {
    console.log('Initializing NFT Art Marketplace...');
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize character counter
    if (nftDescriptionInput) {
        updateCharCount();
    }
    
    // Set default active filter
    setActiveFilter('all');
    
    // Check login status first (from localStorage/sessionStorage)
    checkLoggedInStatus();
    
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        
        try {
            // Setup provider
            provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // Check if user is already connected
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
                showCustomNotification('Connecting to existing wallet...', 'info');
                await connectWallet();
            } else {
                // Show wallet connection message only if user is logged in
                if (isLoggedIn) {
                    showCustomNotification('Connect your wallet to buy, sell, or mint NFTs', 'info', 8000);
                }
                
                // Load placeholder NFTs for browsing
                loadNFTs();
            }
        } catch (error) {
            console.error("Error during initialization:", error);
            showCustomNotification("There was an error initializing the application.", "error");
            loadNFTs(); // Still load placeholder NFTs so the user can browse
        }
    } else {
        console.log('MetaMask is not installed.');
        showCustomNotification('MetaMask is not installed. Some features will be limited.', 'warning');
        
        // Show placeholder data for non-connected users
        loadNFTs();
    }
    
    // Update marketplace statistics
    updateMarketplaceStats();
    
    console.log('Initialization complete!');
}

function setupEventListeners() {
    // Wallet connection
    connectWalletBtn.addEventListener('click', connectWallet);
    
    // NFT Image handling
    nftImageInput.addEventListener('change', handleImageUpload);
    removeImageBtn.addEventListener('click', removeImage);
    
    // Gallery button
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    if (openGalleryBtn) {
        openGalleryBtn.addEventListener('click', openImageGalleryModal);
    }
    
    // Import URL button
    const importURLBtn = document.getElementById('importURLBtn');
    if (importURLBtn) {
        importURLBtn.addEventListener('click', openImageImportModal);
    }
    
    // Form inputs
    nftDescriptionInput.addEventListener('input', updateCharCount);
    resetFormBtn.addEventListener('click', resetForm);
    
    // Mint NFT
    mintNFTBtn.addEventListener('click', mintNFT);
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            setActiveFilter(filter);
            currentPage = 1; // Reset to first page when changing filters
            displayNFTs();
        });
    });
    
    // Search and sort
    searchInput.addEventListener('input', handleSearch);
    sortSelect.addEventListener('change', handleSort);
    
    // Pagination
    prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));
    
    // Modal functionality
    closeModal.addEventListener('click', () => {
        nftModal.classList.add('hidden');
    });
    
    // Buy and list NFT functionality
    buyNFTBtn.addEventListener('click', buyNFT);
    listNFTBtn.addEventListener('click', listNFT);
    cancelListingBtn.addEventListener('click', cancelListing);
    
    // Modal image controls
    fullscreenBtn.addEventListener('click', openFullscreenImage);
    shareBtn.addEventListener('click', shareNFT);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === nftModal) {
            nftModal.classList.add('hidden');
        }
    });
    
    // Contract link
    const contractLink = document.getElementById('contractLink');
    if (contractLink) {
        contractLink.addEventListener('click', (e) => {
            e.preventDefault();
            const network = "mainnet"; // This should be determined dynamically based on the connected network
            const url = `https://${network === 'mainnet' ? '' : network + '.'}etherscan.io/address/${contractAddress}`;
            window.open(url, '_blank');
        });
    }
    
    // Add authentication event listeners
    setupAuthEventListeners();
}

// Wallet Connection
async function connectWallet() {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
        showCustomNotification('Please install MetaMask to use this application!', 'error');
        return false;
    }

    try {
        // Show connecting notification
        showCustomNotification('Connecting to wallet...', 'info');
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Check if accounts were returned
        if (!accounts || accounts.length === 0) {
            showCustomNotification('No accounts found. Please make sure MetaMask is configured correctly.', 'error');
            return false;
        }
        
        // Set up the provider and signer
        currentAccount = accounts[0];
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        
        // Connect to the contract
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        // Update the UI with account info
        connectWalletBtn.classList.add('connected');
        connectWalletBtn.innerHTML = `<i class="fas fa-wallet"></i> ${shortenAddress(currentAccount)}`;
        
        // Display account balance
        const balance = await provider.getBalance(currentAccount);
        const etherBalance = ethers.utils.formatEther(balance);
        
        accountInfoDiv.classList.remove('hidden');
        accountAddressEl.textContent = shortenAddress(currentAccount);
        accountBalanceEl.textContent = parseFloat(etherBalance).toFixed(4) + ' ETH';
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            // Reload the page on account change for simplicity
            window.location.reload();
        });
        
        // Check for network changes
        window.ethereum.on('chainChanged', (chainId) => {
            // Reload the page on network change
            window.location.reload();
        });
        
        // Load NFTs after successful connection
        await loadNFTs();
        
        // Update marketplace stats
        updateMarketplaceStats();
        
        // Show success notification
        showCustomNotification('Wallet connected successfully!', 'success');
        
        return true;
    } catch (error) {
        console.error("Error connecting wallet:", error);
        
        // Handle user rejected request
        if (error.code === 4001) {
            showCustomNotification('You rejected the connection request.', 'error');
        } else {
            showCustomNotification('Error connecting wallet: ' + error.message, 'error');
        }
        
        return false;
    }
}

function setupContractEvents() {
    // Listen for NFT minted events
    contract.on("NFTMinted", async (tokenId, creator, tokenURI) => {
        console.log("NFT Minted:", tokenId.toString(), creator, tokenURI);
        await loadNFTs(); // Reload NFTs when a new one is minted
    });
    
    // Listen for NFT listed events
    contract.on("NFTListed", async (tokenId, price) => {
        console.log("NFT Listed:", tokenId.toString(), ethers.utils.formatEther(price));
        await loadNFTs(); // Reload NFTs when one is listed
    });
    
    // Listen for NFT sold events
    contract.on("NFTSold", async (tokenId, buyer, price) => {
        console.log("NFT Sold:", tokenId.toString(), buyer, ethers.utils.formatEther(price));
        await loadNFTs(); // Reload NFTs when one is sold
    });
}

// Image Handling
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            imagePreviewDiv.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function removeImage(event) {
    event.preventDefault();
    event.stopPropagation();
    
    nftImageInput.value = '';
    imagePreviewDiv.classList.add('hidden');
}

// Form handling functions
function updateCharCount() {
    const count = nftDescriptionInput.value.length;
    charCountEl.textContent = count;
    
    // Change color if getting close to limit
    if (count > 450) {
        charCountEl.style.color = count > 500 ? 'red' : 'orange';
    } else {
        charCountEl.style.color = '#777';
    }
}

function resetForm() {
    nftNameInput.value = '';
    nftDescriptionInput.value = '';
    nftPriceInput.value = '';
    nftImageInput.value = '';
    imagePreviewDiv.classList.add('hidden');
    updateCharCount();
    mintingStatusDiv.classList.add('hidden');
}

// Search and sort functions
function handleSearch() {
    currentSearchTerm = searchInput.value.trim().toLowerCase();
    currentPage = 1; // Reset to first page when searching
    displayNFTs();
}

function handleSort() {
    currentSort = sortSelect.value;
    displayNFTs();
}

// Pagination functions
function changePage(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayNFTs();
    }
}

function updatePagination() {
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// Generate tokenURI and mint NFT
async function mintNFT() {
    const name = document.getElementById('nftName').value;
    const description = document.getElementById('nftDescription').value;
    const price = document.getElementById('nftPrice').value;
    const file = nftImageInput.files[0];
    
    if (!name || !description || !price || !file) {
        showCustomNotification("Please fill all fields", "error");
        return;
    }
    
    // Check if user is logged in first
    if (!isLoggedIn) {
        showCustomNotification("Please login or create an account first", "warning");
        openAuthModal();
        return;
    }
    
    // Then check wallet connection
    if (!currentAccount) {
        const connected = await connectWallet();
        if (!connected) return;
    }
    
    try {
        showMintingStatus("Uploading artwork...", "loading");
        
        // In a real app, you would upload the image to IPFS or another storage service
        // For this example, we'll create a base64 data URI
        const imageDataUrl = await getBase64(file);
        
        // Create metadata (would normally be uploaded to IPFS)
        const metadata = {
            name: name,
            description: description,
            image: imageDataUrl,
            creator: currentUser ? currentUser.name : 'Anonymous',
            creatorEmail: currentUser ? currentUser.email : '', 
        };
        
        const tokenURI = JSON.stringify(metadata);
        showMintingStatus("Minting your NFT...", "loading");
        
        // Convert price to wei
        const priceInWei = ethers.utils.parseEther(price);
        
        // Call the contract's mintNFT function
        const tx = await contract.mintNFT(tokenURI, priceInWei);
        showMintingStatus("Transaction submitted! Waiting for confirmation...", "loading");
        
        await tx.wait();
        
        // Show success message
        showMintingStatus("NFT minted successfully!", "success");
        
        // Clear the form
        resetForm();
        
        // Reload NFTs
        await loadNFTs();
        
    } catch (error) {
        console.error("Error minting NFT:", error);
        showMintingStatus("Error minting NFT: " + error.message, "error");
    }
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function showMintingStatus(message, status) {
    // First update the minting status UI in the form
    mintingStatusDiv.innerHTML = '';
    mintingStatusDiv.className = "status-message";
    mintingStatusDiv.classList.remove('hidden', 'error', 'success', 'loading');
    
    let icon = '';
    switch (status) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            mintingStatusDiv.classList.add('success');
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            mintingStatusDiv.classList.add('error');
            break;
        case 'loading':
        default:
            icon = '<div class="spinner"></div>';
            mintingStatusDiv.classList.add('loading');
            break;
    }
    
    mintingStatusDiv.innerHTML = `
        <div class="status-icon">${icon}</div>
        <div class="status-message">${message}</div>
    `;
    
    mintingStatusDiv.classList.remove('hidden');
    
    // Also show a notification for better user awareness
    showCustomNotification(message, status === 'loading' ? 'info' : status);
}

// NFT Loading and Display
async function loadNFTs() {
    try {
        // For demo purposes, we'll create some example NFTs
        // In a real app, you would load these from the contract
        const exampleNFTs = [
            {
                id: '1',
                name: 'Digital Abstract',
                description: 'Vibrant abstract artwork showcasing digital creativity.',
                image: 'https://source.unsplash.com/random/800x800/?abstract,art',
                creator: currentAccount || contractAddress,
                owner: currentAccount || contractAddress,
                price: '0.75',
                forSale: true
            },
            {
                id: '2',
                name: 'Cyberpunk City',
                description: 'Futuristic cityscape with neon lights and cyber aesthetics.',
                image: 'https://source.unsplash.com/random/800x800/?cyberpunk,city',
                creator: currentAccount || contractAddress,
                owner: '0x8765432109876543210987654321098765432109',
                price: '1.2',
                forSale: true
            },
            {
                id: '3',
                name: 'Space Exploration',
                description: 'A journey through space featuring planets and nebulae.',
                image: 'https://source.unsplash.com/random/800x800/?space,galaxy',
                creator: '0x2345678901234567890123456789012345678901',
                owner: '0x2345678901234567890123456789012345678901',
                price: '2.5',
                forSale: false
            },
            {
                id: '4',
                name: 'Digital Identity',
                description: 'A reflection on digital personhood in the age of NFTs.',
                image: 'https://source.unsplash.com/random/800x800/?digital,portrait',
                creator: '0x3456789012345678901234567890123456789012',
                owner: currentAccount || contractAddress,
                price: '1.8',
                forSale: false
            },
            {
                id: '5',
                name: 'Generative Patterns',
                description: 'Algorithm-generated patterns creating mesmerizing visuals.',
                image: 'https://source.unsplash.com/random/800x800/?pattern,generative',
                creator: currentAccount || contractAddress,
                owner: currentAccount || contractAddress,
                price: '0.9',
                forSale: true
            },
            {
                id: '6',
                name: 'Blockchain Dreams',
                description: 'Visual representation of blockchain technology and its potential.',
                image: 'https://source.unsplash.com/random/800x800/?blockchain,technology',
                creator: '0x4567890123456789012345678901234567890123',
                owner: '0x4567890123456789012345678901234567890123',
                price: '3.2',
                forSale: true
            },
            {
                id: '7',
                name: 'Nature Pixelated',
                description: 'Natural landscapes rendered in pixel art style.',
                image: 'https://source.unsplash.com/random/800x800/?pixel,nature',
                creator: '0x5678901234567890123456789012345678901234',
                owner: '0x5678901234567890123456789012345678901234',
                price: '1.5',
                forSale: false
            },
            {
                id: '8',
                name: 'Crypto Wildlife',
                description: 'Endangered species raising awareness through digital art.',
                image: 'https://source.unsplash.com/random/800x800/?wildlife,animal',
                creator: currentAccount || contractAddress,
                owner: '0x6789012345678901234567890123456789012345',
                price: '2.7',
                forSale: true
            }
        ];
        
        allNFTs = exampleNFTs;
        
        // In a real application, you would fetch NFTs from the contract
        // Example:
        // const tokenCount = await contract.totalSupply();
        // for (let i = 1; i <= tokenCount; i++) {
        //     const tokenId = i.toString();
        //     const tokenURI = await contract.tokenURI(tokenId);
        //     const metadata = await fetch(tokenURI).then(res => res.json());
        //     const owner = await contract.ownerOf(tokenId);
        //     const listing = await contract.getListing(tokenId);
        //     
        //     allNFTs.push({
        //         id: tokenId,
        //         name: metadata.name,
        //         description: metadata.description,
        //         image: metadata.image,
        //         creator: metadata.creator,
        //         owner: owner,
        //         price: ethers.utils.formatEther(listing.price),
        //         forSale: listing.isForSale
        //     });
        // }

        displayNFTs();
        
    } catch (error) {
        console.error("Error loading NFTs:", error);
        nftGallery.innerHTML = '<div class="loading-message error">Error loading NFTs. Please try again.</div>';
    }
}

function displayNFTs() {
    nftGallery.innerHTML = '';
    
    if (allNFTs.length === 0) {
        nftGallery.innerHTML = '<div class="loading-message">No NFTs found. Mint your first NFT!</div>';
        updatePagination();
        return;
    }
    
    // Apply filter
    let filteredNFTs = allNFTs;
    
    if (currentFilter === 'my-nfts' && currentAccount) {
        filteredNFTs = allNFTs.filter(nft => 
            nft.owner.toLowerCase() === currentAccount.toLowerCase()
        );
    } else if (currentFilter === 'for-sale') {
        filteredNFTs = allNFTs.filter(nft => nft.forSale);
    }
    
    // Apply search
    if (currentSearchTerm) {
        filteredNFTs = filteredNFTs.filter(nft => 
            nft.name.toLowerCase().includes(currentSearchTerm) ||
            nft.description.toLowerCase().includes(currentSearchTerm)
        );
    }
    
    // Apply sort
    switch (currentSort) {
        case 'newest':
            filteredNFTs.sort((a, b) => parseInt(b.id) - parseInt(a.id));
            break;
        case 'oldest':
            filteredNFTs.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            break;
        case 'priceLow':
            filteredNFTs.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'priceHigh':
            filteredNFTs.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
    }
    
    if (filteredNFTs.length === 0) {
        nftGallery.innerHTML = '<div class="loading-message">No NFTs found for your search or filter.</div>';
        updatePagination();
        return;
    }
    
    // Calculate pagination
    totalPages = Math.ceil(filteredNFTs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredNFTs.length);
    const paginatedNFTs = filteredNFTs.slice(startIndex, endIndex);
    
    // Create NFT cards
    paginatedNFTs.forEach(nft => {
        const nftCard = document.createElement('div');
        nftCard.className = 'nft-card fade-in';
        nftCard.dataset.id = nft.id;
        
        nftCard.innerHTML = `
            <div class="nft-image">
                <img src="${nft.image}" alt="${nft.name}">
            </div>
            <div class="nft-info">
                <h3 class="nft-title">${nft.name}</h3>
                <p class="nft-creator">Created by ${shortenAddress(nft.creator)}</p>
                <div class="nft-price">
                    <span class="price">${nft.price} ETH</span>
                    <span class="status-badge ${nft.forSale ? 'for-sale' : 'not-for-sale'}">${nft.forSale ? 'For Sale' : 'Not For Sale'}</span>
                </div>
            </div>
        `;
        
        nftCard.addEventListener('click', () => openNFTModal(nft));
        nftGallery.appendChild(nftCard);
    });
    
    // Update pagination controls
    updatePagination();
}

function setActiveFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Helper functions
function shortenAddress(address) {
    return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
}

// Enhanced modal functionality
function openNFTModal(nft) {
    modalImage.src = nft.image;
    modalTitle.textContent = nft.name;
    modalDescription.textContent = nft.description;
    modalCreator.textContent = shortenAddress(nft.creator);
    modalOwner.textContent = shortenAddress(nft.owner);
    modalTokenId.textContent = nft.id;
    modalPrice.textContent = nft.price;
    modalStatus.textContent = nft.forSale ? 'For Sale' : 'Not For Sale';
    modalStatus.className = `attribute-value ${nft.forSale ? 'for-sale-text' : 'not-for-sale-text'}`;
    
    // Set a placeholder mint date (in a real app, this would come from the blockchain)
    const mintDate = new Date();
    mintDate.setDate(mintDate.getDate() - Math.floor(Math.random() * 30)); // Random date within the last 30 days
    modalMintDate.textContent = mintDate.toLocaleDateString();
    
    // Store the NFT ID for buy/sell actions
    buyNFTBtn.dataset.id = nft.id;
    listNFTBtn.dataset.id = nft.id;
    cancelListingBtn.dataset.id = nft.id;
    
    // Show appropriate options
    if (currentAccount && nft.owner.toLowerCase() === currentAccount.toLowerCase()) {
        // Current user owns the NFT
        buyOptions.classList.add('hidden');
        sellOptions.classList.remove('hidden');
        
        // Set current price as default
        sellPriceInput.value = nft.price;
        
        // Configure the listing/cancel buttons based on sale status
        if (nft.forSale) {
            listNFTBtn.classList.add('hidden');
            cancelListingBtn.classList.remove('hidden');
        } else {
            listNFTBtn.classList.remove('hidden');
            cancelListingBtn.classList.add('hidden');
        }
    } else {
        // Someone else owns the NFT
        sellOptions.classList.add('hidden');
        
        if (nft.forSale) {
            buyOptions.classList.remove('hidden');
        } else {
            buyOptions.classList.add('hidden');
        }
    }
    
    // Clear any previous status
    transactionStatus.classList.add('hidden');
    
    // Load transaction history (placeholder in this demo)
    loadTransactionHistory(nft.id);
    
    nftModal.classList.remove('hidden');
}

// Buy NFT
async function buyNFT() {
    if (!currentAccount) {
        const connected = await connectWallet();
        if (!connected) return;
    }
    
    const tokenId = buyNFTBtn.dataset.id;
    
    try {
        // Get the NFT details
        const nft = await contract.nfts(tokenId);
        const priceInWei = nft.price;
        
        // Show transaction status
        showTransactionStatus("Sending transaction...", "loading");
        
        // Call the buyNFT function from the contract
        const tx = await contract.buyNFT(tokenId, { value: priceInWei });
        
        showTransactionStatus("Transaction submitted! Waiting for confirmation...", "loading");
        
        // Wait for transaction to be mined
        await tx.wait();
        
        // Show success message
        showTransactionStatus("Purchase successful! You now own this NFT.", "success");
        
        // Close modal after a delay
        setTimeout(() => {
            nftModal.classList.add('hidden');
            loadNFTs(); // Reload NFTs
        }, 3000);
        
    } catch (error) {
        console.error("Error buying NFT:", error);
        showTransactionStatus("Error buying NFT: " + error.message, "error");
    }
}

// List NFT
async function listNFT() {
    if (!currentAccount) {
        const connected = await connectWallet();
        if (!connected) return;
    }
    
    const tokenId = listNFTBtn.dataset.id;
    const price = sellPriceInput.value;
    
    if (!price || parseFloat(price) <= 0) {
        showTransactionStatus("Please enter a valid price", "error");
        return;
    }
    
    try {
        const priceInWei = ethers.utils.parseEther(price);
        
        // Show transaction status
        showTransactionStatus("Sending transaction...", "loading");
        
        // Call the listNFT function from the contract
        const tx = await contract.listNFT(tokenId, priceInWei);
        
        showTransactionStatus("Transaction submitted! Waiting for confirmation...", "loading");
        
        // Wait for transaction to be mined
        await tx.wait();
        
        // Show success message
        showTransactionStatus("NFT listed successfully!", "success");
        
        // Disable list button
        listNFTBtn.disabled = true;
        listNFTBtn.textContent = "Already Listed";
        
        // Close modal after a delay
        setTimeout(() => {
            nftModal.classList.add('hidden');
            loadNFTs(); // Reload NFTs
        }, 3000);
        
    } catch (error) {
        console.error("Error listing NFT:", error);
        showTransactionStatus("Error listing NFT: " + error.message, "error");
    }
}

function showTransactionStatus(message, status) {
    transactionStatus.innerHTML = '';
    transactionStatus.classList.remove('hidden', 'error', 'success', 'loading');
    
    let icon = '';
    switch (status) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            transactionStatus.classList.add('success');
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            transactionStatus.classList.add('error');
            break;
        case 'loading':
        default:
            icon = '<div class="spinner"></div>';
            transactionStatus.classList.add('loading');
            break;
    }
    
    transactionStatus.innerHTML = `
        <div class="status-icon">${icon}</div>
        <div class="status-message">${message}</div>
    `;
    
    transactionStatus.classList.remove('hidden');
}

// New function for cancelling a listing
async function cancelListing() {
    if (!currentAccount) {
        const connected = await connectWallet();
        if (!connected) return;
    }
    
    const tokenId = cancelListingBtn.dataset.id;
    
    // In a real contract, there would be a cancelListing function
    // For this demo, we'll simulate it by setting a zero price and false forSale status
    try {
        showTransactionStatus("Cancelling listing...", "loading");
        
        // This is a placeholder - in a real contract there would be a dedicated function
        const priceInWei = ethers.utils.parseEther("0");
        const tx = await contract.listNFT(tokenId, priceInWei);
        
        showTransactionStatus("Transaction submitted! Waiting for confirmation...", "loading");
        
        await tx.wait();
        
        // Update the NFT in our local array
        const nftIndex = allNFTs.findIndex(nft => nft.id === tokenId);
        if (nftIndex !== -1) {
            allNFTs[nftIndex].forSale = false;
        }
        
        showTransactionStatus("Listing cancelled successfully!", "success");
        
        // Close modal after a delay
        setTimeout(() => {
            nftModal.classList.add('hidden');
            displayNFTs(); // Refresh the display
        }, 3000);
        
    } catch (error) {
        console.error("Error cancelling listing:", error);
        showTransactionStatus("Error cancelling listing: " + error.message, "error");
    }
}

// Load transaction history (placeholder)
function loadTransactionHistory(tokenId) {
    transactionList.innerHTML = '';
    
    // In a real app, you would fetch the transaction history from the blockchain
    // For now, we'll use placeholder data
    const hasHistory = Math.random() > 0.5; // Randomly determine if we show history
    
    if (!hasHistory) {
        transactionList.innerHTML = '<div class="empty-transactions">No transactions yet</div>';
        return;
    }
    
    const createDate = new Date();
    createDate.setDate(createDate.getDate() - Math.floor(Math.random() * 30));
    
    const txs = [
        {
            type: 'mint',
            date: createDate,
            from: '0x0000000000000000000000000000000000000000',
            to: allNFTs.find(nft => nft.id === tokenId)?.creator || '0x436a5fe44a607caB47dE49C0122e8ADC270e0331',
            price: '-'
        }
    ];
    
    // Add some random transactions
    if (Math.random() > 0.5) {
        const listDate = new Date(createDate);
        listDate.setDate(listDate.getDate() + Math.floor(Math.random() * 5) + 1);
        
        txs.push({
            type: 'list',
            date: listDate,
            from: allNFTs.find(nft => nft.id === tokenId)?.creator || '0x436a5fe44a607caB47dE49C0122e8ADC270e0331',
            to: '-',
            price: (Math.random() * 2 + 0.1).toFixed(2)
        });
        
        if (Math.random() > 0.5) {
            const sellDate = new Date(listDate);
            sellDate.setDate(sellDate.getDate() + Math.floor(Math.random() * 5) + 1);
            
            const buyer = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            
            txs.push({
                type: 'sale',
                date: sellDate,
                from: allNFTs.find(nft => nft.id === tokenId)?.creator || '0x436a5fe44a607caB47dE49C0122e8ADC270e0331',
                to: buyer,
                price: (Math.random() * 2 + 0.1).toFixed(2)
            });
        }
    }
    
    // Sort by date
    txs.sort((a, b) => b.date - a.date);
    
    // Create the transaction items
    txs.forEach(tx => {
        const txItem = document.createElement('div');
        txItem.className = 'transaction-item';
        
        let typeIcon, typeLabel;
        switch (tx.type) {
            case 'mint':
                typeIcon = 'fa-paint-brush';
                typeLabel = 'Minted';
                break;
            case 'list':
                typeIcon = 'fa-tag';
                typeLabel = 'Listed';
                break;
            case 'sale':
                typeIcon = 'fa-exchange-alt';
                typeLabel = 'Sold';
                break;
        }
        
        txItem.innerHTML = `
            <div class="tx-icon"><i class="fas ${typeIcon}"></i></div>
            <div class="tx-details">
                <div class="tx-type">${typeLabel}</div>
                <div class="tx-info">
                    <span>From: ${shortenAddress(tx.from)}</span>
                    <span>To: ${tx.to === '-' ? '-' : shortenAddress(tx.to)}</span>
                </div>
                <div class="tx-price">${tx.price === '-' ? '-' : tx.price + ' ETH'}</div>
                <div class="tx-date">${tx.date.toLocaleDateString()} ${tx.date.toLocaleTimeString()}</div>
            </div>
        `;
        
        transactionList.appendChild(txItem);
    });
}

// Enhanced modal functionality
function openFullscreenImage() {
    const img = modalImage.src;
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <html>
            <head>
                <title>NFT Image</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: #000;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    img {
                        max-width: 100%;
                        max-height: 100vh;
                        object-fit: contain;
                    }
                </style>
            </head>
            <body>
                <img src="${img}" alt="NFT Image">
            </body>
        </html>
    `);
}

function shareNFT() {
    const currentNFT = allNFTs.find(nft => nft.id === modalTokenId.textContent);
    if (!currentNFT) return;
    
    // In a real app, this would create a shareable URL
    const shareText = `Check out this NFT: ${currentNFT.name} on ArtChain`;
    
    // If Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: currentNFT.name,
            text: shareText,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareText + ' - ' + window.location.href)
            .then(() => {
                showCustomNotification('Link copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }
}

// Helper function to show custom notifications
function showCustomNotification(message, type = 'info', duration = 5000) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add icon based on notification type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'info':
        default:
            icon = '<i class="fas fa-info-circle"></i>';
            break;
    }
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add notification to the document
    document.body.appendChild(notification);
    
    // Add event listener to close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('slide-out');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove notification after duration
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('slide-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
    
    // Add slide-in animation
    setTimeout(() => notification.classList.add('slide-in'), 10);
    
    return notification;
}

// Replace old notification function with the new one
function showNotification(message, type) {
    showCustomNotification(message, type);
}

// Update marketplace stats
function updateMarketplaceStats() {
    const totalNFTs = document.getElementById('totalNFTs');
    const nftsForSale = document.getElementById('nftsForSale');
    const totalUsers = document.getElementById('totalUsers'); 
    const totalVolume = document.getElementById('totalVolume');
    
    if (totalNFTs) {
        totalNFTs.textContent = allNFTs.length;
    }
    
    if (nftsForSale) {
        const forSaleCount = allNFTs.filter(nft => nft.forSale).length;
        nftsForSale.textContent = forSaleCount;
    }
    
    if (totalUsers) {
        // Get unique creators and owners
        const uniqueUsers = new Set();
        allNFTs.forEach(nft => {
            uniqueUsers.add(nft.creator.toLowerCase());
            uniqueUsers.add(nft.owner.toLowerCase());
        });
        totalUsers.textContent = uniqueUsers.size;
    }
    
    if (totalVolume) {
        // In a real app, this would be calculated from actual sales
        // For now, we'll use a placeholder value based on NFT count
        const volume = allNFTs.length * (Math.random() * 0.5 + 0.1);
        totalVolume.textContent = volume.toFixed(2) + ' ETH';
    }
}

// Initialize contract link in footer
function initializeContractLink() {
    const contractLink = document.getElementById('contractLink');
    if (contractLink) {
        // Use Etherscan or appropriate block explorer based on the network
        contractLink.href = `https://etherscan.io/address/${contractAddress}`;
    }
}

// Handle account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            // User disconnected
            currentAccount = null;
            connectWalletBtn.classList.remove('hidden');
            accountInfoDiv.classList.add('hidden');
        } else {
            // Account changed, refresh the page
            window.location.reload();
        }
    });
    
    window.ethereum.on('chainChanged', () => {
        // Chain changed, refresh the page
        window.location.reload();
    });
}

// Add auth-related event listeners
function setupAuthEventListeners() {
    // Open auth modal
    loginSignupBtn.addEventListener('click', openAuthModal);
    
    // Close auth modal
    closeAuthModal.addEventListener('click', () => {
        authModal.classList.add('hidden');
    });
    
    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchAuthTab(tabName);
        });
    });
    
    // Toggle password visibility
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
    
    // Password strength meter
    if (signupPassword) {
        signupPassword.addEventListener('input', checkPasswordStrength);
    }
    
    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Click outside to close
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.add('hidden');
        }
    });
    
    // Check if user is already logged in (from localStorage)
    checkLoggedInStatus();
}

// Open auth modal
function openAuthModal() {
    authModal.classList.remove('hidden');
    // Default to login tab
    switchAuthTab('login');
}

// Switch between login and signup tabs
function switchAuthTab(tabName) {
    // Update tab buttons
    authTabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Show selected form
    if (tabName === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

// Check password strength
function checkPasswordStrength() {
    const password = signupPassword.value;
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Update the strength bar
    if (password.length === 0) {
        strengthBar.style.width = '0';
        strengthBar.className = 'strength-bar';
        strengthText.textContent = 'Password strength';
    } else if (strength < 2) {
        strengthBar.style.width = '30%';
        strengthBar.className = 'strength-bar weak';
        strengthText.textContent = 'Weak';
    } else if (strength < 4) {
        strengthBar.style.width = '70%';
        strengthBar.className = 'strength-bar medium';
        strengthText.textContent = 'Medium';
    } else {
        strengthBar.style.width = '100%';
        strengthBar.className = 'strength-bar strong';
        strengthText.textContent = 'Strong';
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Simulate API call with a timeout
    showCustomNotification('Logging in...', 'info');
    
    setTimeout(() => {
        // In a real app, this would be an API call to your authentication endpoint
        // For demo purposes, we'll just accept any login
        
        // Create a user object
        const user = {
            name: email.split('@')[0], // Use part of email as name for demo
            email: email,
            avatar: email.charAt(0).toUpperCase(),
            // In a real app, never store the actual password in localStorage
            token: 'demo_token_' + Math.random().toString(36).substring(2)
        };
        
        // Login the user
        loginUser(user, rememberMe);
        
        // Close the modal
        authModal.classList.add('hidden');
        
        showCustomNotification('Login successful!', 'success');
    }, 1500);
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAgreed = document.getElementById('termsAgree').checked;
    
    // Basic validation
    if (!termsAgreed) {
        showCustomNotification('You must agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showCustomNotification('Passwords do not match', 'error');
        return;
    }
    
    // Check password strength
    const strength = strengthBar.className.includes('weak') ? 1 : (strengthBar.className.includes('medium') ? 2 : 3);
    if (strength < 2) {
        showCustomNotification('Please choose a stronger password', 'warning');
        return;
    }
    
    // Simulate API call with a timeout
    showCustomNotification('Creating your account...', 'info');
    
    setTimeout(() => {
        // In a real app, this would be an API call to your registration endpoint
        
        // Create a user object
        const user = {
            name: name,
            email: email,
            avatar: name.charAt(0).toUpperCase(),
            // In a real app, never store the actual password
            token: 'demo_token_' + Math.random().toString(36).substring(2)
        };
        
        // Login the user (auto-login after signup)
        loginUser(user, true);
        
        // Close the modal
        authModal.classList.add('hidden');
        
        showCustomNotification('Account created successfully!', 'success');
    }, 1500);
}

// Login the user
function loginUser(user, rememberMe) {
    currentUser = user;
    isLoggedIn = true;
    
    // Update UI to show logged in state
    updateUserInterface();
    
    // Save to localStorage if remember me is checked
    if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        // Use sessionStorage if not remembering
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
}

// Logout the user
function logoutUser() {
    currentUser = null;
    isLoggedIn = false;
    
    // Update UI to show logged out state
    updateUserInterface();
    
    // Clear stored data
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    showCustomNotification('You have been logged out', 'info');
}

// Update UI based on login status
function updateUserInterface() {
    if (isLoggedIn && currentUser) {
        // Hide login button
        loginSignupBtn.innerHTML = `
            <div class="user-profile">
                <div class="profile-avatar">${currentUser.avatar}</div>
                <div class="profile-dropdown">
                    <div class="profile-header">
                        <div class="profile-name">${currentUser.name}</div>
                        <div class="profile-email">${currentUser.email}</div>
                    </div>
                    <div class="profile-menu">
                        <div class="profile-menu-item" id="myProfileBtn">
                            <i class="fas fa-user"></i> My Profile
                        </div>
                        <div class="profile-menu-item" id="myNFTsBtn">
                            <i class="fas fa-images"></i> My NFTs
                        </div>
                        <div class="profile-menu-item" id="settingsBtn">
                            <i class="fas fa-cog"></i> Settings
                        </div>
                        <div class="profile-menu-item" id="logoutBtn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Set up profile dropdown
        const userProfile = document.querySelector('.user-profile');
        const profileDropdown = document.querySelector('.profile-dropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        const myNFTsBtn = document.getElementById('myNFTsBtn');
        
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        
        logoutBtn.addEventListener('click', logoutUser);
        
        myNFTsBtn.addEventListener('click', () => {
            // Close dropdown
            profileDropdown.classList.remove('show');
            
            // Switch to My NFTs filter
            setActiveFilter('my-nfts');
            currentPage = 1;
            displayNFTs();
            
            // Scroll to marketplace
            document.querySelector('.marketplace-section').scrollIntoView({ behavior: 'smooth' });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            profileDropdown.classList.remove('show');
        });
    } else {
        // Show login button
        loginSignupBtn.innerHTML = '<i class="fas fa-user-circle"></i> Login';
    }
}

// Check if user is already logged in
function checkLoggedInStatus() {
    // Check localStorage first (for remembered logins)
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        isLoggedIn = true;
        updateUserInterface();
    }
}

// Open image gallery modal to select an image
function openImageGalleryModal() {
    // Create gallery modal if it doesn't exist
    let galleryModal = document.getElementById('imageGalleryModal');
    
    if (!galleryModal) {
        galleryModal = document.createElement('div');
        galleryModal.id = 'imageGalleryModal';
        galleryModal.className = 'modal';
        
        galleryModal.innerHTML = `
            <div class="modal-content image-gallery-modal">
                <span class="close-modal" id="closeGalleryModal">&times;</span>
                <h3><i class="fas fa-images"></i> Select an Image</h3>
                <div class="gallery-search">
                    <input type="text" id="gallerySearch" placeholder="Search for more images...">
                    <button id="searchGalleryBtn"><i class="fas fa-search"></i></button>
                </div>
                <div class="image-gallery-grid" id="imageGalleryGrid"></div>
                <div class="gallery-actions">
                    <button id="uploadCustomImage" class="secondary-button">
                        <i class="fas fa-upload"></i> Upload Custom Image
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(galleryModal);
        
        // Add event listeners
        document.getElementById('closeGalleryModal').addEventListener('click', () => {
            galleryModal.classList.add('hidden');
        });
        
        document.getElementById('uploadCustomImage').addEventListener('click', () => {
            galleryModal.classList.add('hidden');
            nftImageInput.click();
        });
        
        // Add search functionality
        const searchInput = document.getElementById('gallerySearch');
        const searchBtn = document.getElementById('searchGalleryBtn');
        
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchGalleryImages(searchTerm);
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    searchGalleryImages(searchTerm);
                }
            }
        });
        
        // Close when clicking outside
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.classList.add('hidden');
            }
        });
    }
    
    // Populate gallery grid with default images
    populateGalleryGrid(localImageGallery);
    
    // Show modal
    galleryModal.classList.remove('hidden');
}

// Search for additional gallery images
function searchGalleryImages(searchTerm) {
    const galleryGrid = document.getElementById('imageGalleryGrid');
    
    // Show loading state
    galleryGrid.innerHTML = `
        <div class="gallery-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Searching for "${searchTerm}"...</p>
        </div>
    `;
    
    // Fetch images from Unsplash
    // Note: In a production app, you would use your own API key and proper attribution
    const searchUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(searchTerm)}`;
    
    // Generate a set of random images based on the search term
    const searchResults = [];
    const totalResults = 8;
    
    // Create promises for all image fetches
    const promises = [];
    
    for (let i = 0; i < totalResults; i++) {
        // Add random parameter to avoid cache
        const uniqueUrl = `${searchUrl}&random=${Math.random()}`;
        
        // Create a promise that resolves with the image data
        const promise = new Promise((resolve) => {
            // We can't directly get the redirected URL, so we'll create an image element
            const img = new Image();
            img.onload = function() {
                resolve({
                    id: `search-${i}`,
                    name: `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} ${i+1}`,
                    thumbnail: this.src,
                    fullImage: this.src
                });
            };
            img.onerror = function() {
                resolve(null); // Resolve with null if there's an error
            };
            img.src = uniqueUrl;
        });
        
        promises.push(promise);
    }
    
    // Wait for all promises to resolve
    Promise.all(promises)
        .then(results => {
            // Filter out any null results
            const validResults = results.filter(result => result !== null);
            
            if (validResults.length > 0) {
                // Populate the gallery with search results
                populateGalleryGrid(validResults);
            } else {
                galleryGrid.innerHTML = `
                    <div class="gallery-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>No images found for "${searchTerm}". Try a different search term.</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error searching for images:', error);
            galleryGrid.innerHTML = `
                <div class="gallery-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error searching for images. Please try again.</p>
                </div>
            `;
        });
}

// Populate the gallery grid with images
function populateGalleryGrid(images) {
    const galleryGrid = document.getElementById('imageGalleryGrid');
    galleryGrid.innerHTML = '';
    
    images.forEach(image => {
        const imageItem = document.createElement('div');
        imageItem.className = 'gallery-image-item';
        imageItem.innerHTML = `
            <img src="${image.thumbnail}" alt="${image.name}">
            <div class="image-name">${image.name}</div>
        `;
        
        imageItem.addEventListener('click', () => {
            selectGalleryImage(image);
            document.getElementById('imageGalleryModal').classList.add('hidden');
        });
        
        galleryGrid.appendChild(imageItem);
    });
    
    // Add Upload Your Own option
    const uploadOption = document.createElement('div');
    uploadOption.className = 'gallery-image-item upload-option';
    uploadOption.innerHTML = `
        <div class="upload-placeholder">
            <i class="fas fa-plus"></i>
            <div>Upload Your Own</div>
        </div>
    `;
    
    uploadOption.addEventListener('click', () => {
        document.getElementById('imageGalleryModal').classList.add('hidden');
        nftImageInput.click();
    });
    
    galleryGrid.appendChild(uploadOption);
}

// Open image import modal
function openImageImportModal() {
    // Create import modal if it doesn't exist
    let importModal = document.getElementById('imageImportModal');
    
    if (!importModal) {
        importModal = document.createElement('div');
        importModal.id = 'imageImportModal';
        importModal.className = 'modal hidden';
        
        importModal.innerHTML = `
            <div class="modal-content import-modal">
                <span class="close-modal" id="closeImportModal">&times;</span>
                <h3><i class="fas fa-link"></i> Import Image from URL</h3>
                <div class="form-group">
                    <label for="imageURL">Image URL</label>
                    <input type="url" id="imageURL" placeholder="https://example.com/image.jpg">
                </div>
                <div class="import-preview hidden" id="importPreview">
                    <img id="importPreviewImg" src="#" alt="Preview">
                </div>
                <div class="form-actions">
                    <button id="loadImageFromURL" class="secondary-button">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button id="importImageFromURL" class="cta-button" disabled>
                        <i class="fas fa-download"></i> Import
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(importModal);
        
        // Add event listeners
        document.getElementById('closeImportModal').addEventListener('click', () => {
            importModal.classList.add('hidden');
        });
        
        const imageUrlInput = document.getElementById('imageURL');
        const loadImageBtn = document.getElementById('loadImageFromURL');
        const importImageBtn = document.getElementById('importImageFromURL');
        const importPreview = document.getElementById('importPreview');
        const importPreviewImg = document.getElementById('importPreviewImg');
        
        loadImageBtn.addEventListener('click', () => {
            const url = imageUrlInput.value.trim();
            if (url) {
                // Show loading state
                loadImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                loadImageBtn.disabled = true;
                
                // Load the image
                importPreviewImg.onload = () => {
                    importPreview.classList.remove('hidden');
                    importImageBtn.disabled = false;
                    loadImageBtn.innerHTML = '<i class="fas fa-eye"></i> Preview';
                    loadImageBtn.disabled = false;
                };
                
                importPreviewImg.onerror = () => {
                    showCustomNotification('Invalid image URL or image could not be loaded', 'error');
                    loadImageBtn.innerHTML = '<i class="fas fa-eye"></i> Preview';
                    loadImageBtn.disabled = false;
                };
                
                importPreviewImg.src = url;
            } else {
                showCustomNotification('Please enter a valid URL', 'warning');
            }
        });
        
        importImageBtn.addEventListener('click', () => {
            const url = imageUrlInput.value.trim();
            importImageFromURL(url);
            importModal.classList.add('hidden');
        });
        
        // Close when clicking outside
        importModal.addEventListener('click', (e) => {
            if (e.target === importModal) {
                importModal.classList.add('hidden');
            }
        });
    }
    
    // Reset the form
    document.getElementById('imageURL').value = '';
    document.getElementById('importPreview').classList.add('hidden');
    document.getElementById('importImageFromURL').disabled = true;
    
    // Show modal
    importModal.classList.remove('hidden');
}

// Import image from URL
function importImageFromURL(url) {
    if (!url) return;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            // Get filename from URL
            const urlParts = url.split('/');
            const filename = urlParts[urlParts.length - 1] || 'imported-image.jpg';
            
            // Create File object
            const file = new File([blob], filename, { type: blob.type });
            
            // Create DataTransfer object to simulate file input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            nftImageInput.files = dataTransfer.files;
            
            // Update preview
            previewImg.src = URL.createObjectURL(blob);
            imagePreviewDiv.classList.remove('hidden');
            
            showCustomNotification('Image imported successfully!', 'success');
        })
        .catch(error => {
            console.error('Error importing image:', error);
            showCustomNotification('Error importing image: ' + error.message, 'error');
        });
}

// Select image from gallery
function selectGalleryImage(image) {
    // Create a File object from the URL (simulate file upload)
    fetch(image.fullImage)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], `${image.name}.jpg`, { type: 'image/jpeg' });
            
            // Create a DataTransfer object to simulate a file input change event
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            nftImageInput.files = dataTransfer.files;
            
            // Trigger the image preview
            previewImg.src = image.fullImage;
            imagePreviewDiv.classList.remove('hidden');
            
            // Show notification
            showCustomNotification(`Selected image: ${image.name}`, 'success');
        })
        .catch(error => {
            console.error('Error selecting gallery image:', error);
            showCustomNotification('Error selecting image. Please try another.', 'error');
        });
} 