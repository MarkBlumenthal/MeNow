// hooks used
import React, { useState, useEffect } from 'react'; 
// import axios to make HTTP requests
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import the modal used to display the popup message
import { Modal, Button } from 'react-bootstrap';
import './App.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [randomImages, setRandomImages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // hook used to get the images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  // #***************************************************************************************************************#

// Function to fetch images from the server
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/images');
      setImages(response.data);
      setRandomImages(getRandomImages(response.data, 5));
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

// use an arrow function get the images and shuffle them randomly
  const getRandomImages = (images, count) => {
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Here we display the images searched by keywords from the highest score to lowest score
  const handleSearch = () => {
    const filtered = images
      .filter(image => image.keywords.includes(searchTerm))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

      // Show modal if no products are found  
    if (filtered.length === 0) {
      setShowModal(true);
    } else {
      setRandomImages(filtered);
    }
  };


  // Function to handle the display of new random images
  const handleNewRandomImages = () => {
    setRandomImages(getRandomImages(images, 5));
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.alt = 'Failed to load image';
  };

  // use an async function update the score of an image
  const updateScore = async (id, newScore) => {
    try {
      await axios.post('http://localhost:3000/api/update-score', { id, newScore });
      fetchImages(); // Refresh the images after updating the score
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

// #**************************************************************************************************************#

// Here we are using Bootstrap to effectivley display the images/products and have it responsive

  return (
    <div className="container">
      <h1 className="my-4">MeNow Product Search</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by keyword"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-pink btn-rounded mt-2" onClick={handleSearch}>
          Search
        </button>
      </div>
      <button className="btn btn-secondary mb-4" onClick={handleNewRandomImages}>
        Show Random Images
      </button>
      <div className="row">
        {randomImages.map((image, index) => {
          const animationDelay = `${index * 0.5}s`;
          return (                                                 
            <div className="col-md-4 mb-4 fade-in" key={image.id} style={{ animationDelay }}> 
              <div className="card">
                <img
                  src={image.path}
                  className="card-img-top"
                  alt={image.keywords.join(', ')}
                  onError={handleImageError}
                />
                <div className="card-body">
                  <p className="card-text">Keywords: {image.keywords.join(', ')}</p>
                  <p className="card-text">Score: {image.score}</p>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Enter new score"
                    onChange={e => image.newScore = e.target.value}
                  />
                  <button
                    className="btn btn-pink btn-rounded"
                    onClick={() => updateScore(image.id, image.newScore)}
                  >
                    Update Score
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

{/* #***********************************************************************************************************# */}

{/* /* modal used when the keyword searched does not match anything in the API */ }
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>No Products Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sorry but no product exists for that keyword.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
