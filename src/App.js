import React, { useEffect, useState } from 'react';
import './App.css';

// Constants

const TEST_IMGS = [
  'https://t4.ftcdn.net/jpg/03/36/26/53/360_F_336265345_U65QKmIeAmmpaPM2C1QaQKhDG7AxoMl9.jpg',
  'https://media.istockphoto.com/id/1329031407/photo/young-man-with-backpack-taking-selfie-portrait-on-a-mountain-smiling-happy-guy-enjoying.jpg?s=612x612&w=0&k=20&c=WvjAEx3QlWoAn49drp0N1vmxAgGObxWDpoXtaU2iB4Q=',
  'https://img.freepik.com/free-photo/debonair-young-woman-making-selfie-balcony-portrait-smiling-dreamy-girl-posing-beside-orange-flowers_197531-12244.jpg?w=2000',
  'https://media.istockphoto.com/id/1390884026/photo/young-man-on-a-taking-selfie-at-home-camera-point-of-view.jpg?s=170667a&w=0&k=20&c=_dwyV0_4f2lXRfOEcqYrH8fTo_DrzGsX5NHM64JKdak='
]

const App = () => {
  // State 
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [selfieList, setSelfieList] = useState([]);

  // Actions
  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
      const response = await window.solana.connect({ onlyIfTrusted: true });
      console.log(
        'Connected with Public Key:',
        response.publicKey.toString()
      );

      /*
       * Set the user's publicKey in state to be used later
       */
      setWalletAddress(response.publicKey.toString());
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendSelfie = async () => {
    if (inputValue.length > 0) {
      console.log('Selfie link:', inputValue);
      setSelfieList([...selfieList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendSelfie();
        }}
      >
        <input type="text" placeholder="Enter selfie link!" value={inputValue} onChange={onInputChange} />
        <button type="submit" className="cta-button submit-selfie-button">Submit</button>
      </form>
      <div className="selfie-grid">
        {selfieList.map(selfie => (
          <div className="selfie-item" key={selfie}>
            <img src={selfie} alt={selfie} />
          </div>
        ))}
      </div>
    </div>
  );

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching SELFIE list...');
      
      // Call Solana program here.
  
      // Set state
      setSelfieList(TEST_IMGS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">SOLOGRAM 🤳</p>
          <p className="sub-text">
            ✨ Add your selfie to the wall!
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          {/* <p>2022 - Michael Ferrara</p> */}
        </div>
      </div>
    </div>
  );
};

export default App;