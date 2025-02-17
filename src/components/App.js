import { useEffect, useState } from 'react';
import bg from '../resources/bg-cafe.jpg';
import starFill from '../resources/Star_fill.svg';
import star from '../resources/Star.svg';

export default function App() {
  const [coffees, setCoffees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableNow, setAvailableNow] = useState(false);

  let sortedCoffees = coffees;

  if (availableNow === true) sortedCoffees = coffees.slice().filter((coffee) => coffee.available);

  useEffect(function () {
    async function getCoffees() {
      setIsLoading(true);

      try {
        const res = await fetch(
          'https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/simple-coffee-listing-data.json'
        );

        if (!res.ok) throw new Error('something went wrong');

        const data = await res.json();

        setCoffees(data);
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    getCoffees();
  }, []);

  return (
    <div className="app">
      <img src={bg} alt="background" className="bg-image" />
      <div className="bg-color"></div>
      <Collections>
        <CollectionInfo availableNow={availableNow} onAvailableNow={setAvailableNow} />

        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <Menu coffees={sortedCoffees} />
        )}
      </Collections>
    </div>
  );
}

function Collections({ children }) {
  return <section className="collection">{children}</section>;
}

function CollectionInfo({ availableNow, onAvailableNow }) {
  return (
    <div className="collection-info">
      <h1 className="collection-heading">Our Collection</h1>
      <p className="collection-description">
        Introducing our Coffee Collection, a selection of unique coffees from different roast types
        and origins, expertly roasted in small batches and shipped fresh weekly.
      </p>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${availableNow ? '' : 'active'} `}
          onClick={() => onAvailableNow(false)}
        >
          All Products
        </button>
        <button
          className={`filter-btn ${availableNow ? 'active' : ''}`}
          onClick={() => onAvailableNow(true)}
        >
          Available Now
        </button>
      </div>
    </div>
  );
}

function Menu({ coffees }) {
  return (
    <ul className="menu">
      {coffees.map((coffee) => (
        <Item coffee={coffee} key={coffee.id} />
      ))}
    </ul>
  );
}

function Item({ coffee }) {
  return (
    <li>
      <img src={coffee.image} alt={coffee.name} className="coffee-image" />
      <div className="coffee-details">
        <span className="coffe-name">{coffee.name}</span>
        <span className="coffe-price">{coffee.price}</span>
      </div>
      <div className="product-rating">
        <img className="star" src={coffee.rating ? starFill : star} alt="star fill" />
        {coffee.rating ? (
          <>
            <span className="coffee-rating">{coffee.rating}</span>
            <span className="coffee-vote">({coffee.votes} votes)</span>
          </>
        ) : (
          <span className="coffee-vote">No Rating</span>
        )}
        {coffee.available ? null : <span className="sold-out">Sold Out</span>}
      </div>
      {coffee.popular ? <span className="popular">Popular</span> : null}
    </li>
  );
}

function Loader() {
  return <h2 className="loader">Loading...</h2>;
}

function ErrorMessage({ message }) {
  return <h2 className="error-message">{message}</h2>;
}
