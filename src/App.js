import './App.css';
import Layout from './components/layout/Layout';
import {Routes, Route} from 'react-router-dom';
import Home from './components/home/Home';
import WatchList from './components/home/WatchList';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviewForm/Reviews';
import NotFound from './components/notFound/NotFound';
import Login from './components/login/Login';
import Register from './components/register/Register';
import { useState,useEffect, useCallback } from 'react';
import MoviePlayerWithInput from './components/player/MoviePlayerWithInput';
import Favorites from './components/favorites/Favorites';

function App () {
  const [movies, setMovies] = useState();
  const [movie, setMovie] = useState();
  const [reviews, setReviews] = useState([]);
  
  const getMovies = useCallback(async () =>{
    
    try {
      const res = await fetch("/api/v1/movies");
      if(!res.ok) throw new Error('Failed to load movies');
      const data = await res.json();
      setMovies(data);
    } 
    catch(err)
     {
      console.log(err);
      // Fallback mock data for testing the hero carousel
      const mockMovies = [
        {
          imdbId: "tt1630029",
          title: "Avatar: The Way of Water",
          releaseDate: "2022-12-16",
          genres: ["Action", "Adventure", "Sci-Fi"],
          poster: "/OIP.jpeg",
          backdrops: ["/assets/background.jpg"],
          trailerLink: "https://www.youtube.com/watch?v=d9MyW72ELq0",
          plot: "Jake Sully and Ney'tiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the regions of Pandora."
        },
        {
          imdbId: "tt0111161",
          title: "The Shawshank Redemption",
          releaseDate: "1994-10-14",
          genres: ["Drama", "Crime"],
          poster: "/OIP.jpeg",
          backdrops: ["/assets/background.jpg"],
          trailerLink: "https://www.youtube.com/watch?v=6hB3S9bIaco",
          plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
        },
        {
          imdbId: "tt0068646",
          title: "The Godfather",
          releaseDate: "1972-03-24",
          genres: ["Crime", "Drama"],
          poster: "/OIP.jpeg",
          backdrops: ["/assets/background.jpg"],
          trailerLink: "https://www.youtube.com/watch?v=sY1S34973zA",
          plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
        },
        {
          imdbId: "tt0468569",
          title: "The Dark Knight",
          releaseDate: "2008-07-18",
          genres: ["Action", "Crime", "Drama"],
          poster: "/OIP.jpeg",
          backdrops: ["/assets/background.jpg"],
          trailerLink: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
          plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
        },
        {
          imdbId: "tt0071562",
          title: "The Godfather Part II",
          releaseDate: "1974-12-20",
          genres: ["Crime", "Drama"],
          poster: "/OIP.jpeg",
          backdrops: ["/assets/background.jpg"],
          trailerLink: "https://www.youtube.com/watch?v=8PyZCU2vpi8",
          plot: "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate."
        },
        {
          imdbId: "tt0050083",
          title: "12 Angry Men",
          releaseDate: "1957-04-10",
          genres: ["Crime", "Drama"],
          poster: "/OIP.jpeg",
          backdrops: ["/assets/background.jpg"],
          trailerLink: "https://www.youtube.com/watch?v=2L3Uvn3TRc0",
          plot: "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence."
        },
        {
          imdbId: "tt0108052",
          title: "Schindler's List",
          releaseDate: "1993-12-15",
          genres: ["Biography", "Drama", "History"],
          poster: "/OIP.jpeg",
          backdrops: ["/assets/background.jpg"],
          trailerLink: "https://www.youtube.com/watch?v=mxphAlJID9U",
          plot: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis."
        },
        {
          imdbId: "tt0167260",
          title: "The Lord of the Rings: The Return of the King",
          releaseDate: "2003-12-17",
          genres: ["Adventure", "Drama", "Fantasy"],
          poster: "/OIP.jpeg",
          backdrops: ["/assets/background.jpg"],
          trailerLink: "https://www.youtube.com/watch?v=r5X-hFf6Bwo",
          plot: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring."
        },
        {
          imdbId: "tt0060196",
          title: "The Good, the Bad and the Ugly",
          releaseDate: "1966-12-23",
          genres: ["Western"],
          poster: "/OIP.jpeg",
          backdrops: ["/assets/background.jpg"],
          trailerLink: "https://www.youtube.com/watch?v=IFN4zOjUxmY",
          plot: "A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery."
        },
        {
          imdbId: "tt0109830",
          title: "Forrest Gump",
          releaseDate: "1994-07-06",
          genres: ["Drama", "Romance"],
          poster: "/OIP.jpeg",
          backdrops: ["/assets/background.jpg"],
          trailerLink: "https://www.youtube.com/watch?v=bLvqoHBptjg",
          plot: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75."
        }
      ];
      setMovies(mockMovies);
    }
  }, [])

  const getMovieData = useCallback(async (movieId) =>{
    try {
      const res = await fetch(`/api/v1/movies/${movieId}`);
      if(!res.ok) throw new Error('Failed to load movie');
      const data = await res.json();
      setMovie(data);
      const serverReviews = data?.reviews || data?.reviewIds || [];
      setReviews(serverReviews);
    }
    catch(err){
      console.log(err);
    }
  }, [])

  
  useEffect(() => {
    getMovies();
  },[getMovies]);
   return (
   <div className="App">
    <Routes>
         <Route path="/" element={<Layout/>}>
           <Route index element={<Home movies={movies} />}/>
           <Route path="login" element={<Login />} />  {/* MOVED INSIDE Layout */}
           <Route path="register" element={<Register />} />  {/* MOVED INSIDE Layout */}
           <Route path="watchList" element={<WatchList/>} />
           <Route path="play" element={<MoviePlayerWithInput />} />
           <Route path="favorites" element={<Favorites />} />
           <Route path="Trailer/:ytTrailerId" element={<Trailer/>} />
           <Route path="Reviews/:movieId" element={<Reviews getMovieData={getMovieData} movie={movie} reviews={reviews} setReviews={setReviews} />} />
           <Route path="*" element={<NotFound/>} />
         </Route>
       </Routes>
   </div>
  );
}

export default App;