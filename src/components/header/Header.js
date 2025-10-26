import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoSlash, faSearch, faUser, faUserPlus, faSignOutAlt, faUserCircle, faHeart, faBookmark } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {NavLink, useNavigate} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './header.css';

const Header = () => {
    const [videoUrl, setVideoUrl] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (videoUrl.trim()) {
            navigate(`/play?url=${encodeURIComponent(videoUrl)}`);
            setVideoUrl("");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    useEffect(() => {
        // Check for authenticated user on component mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
            }
        }

        // Listen for storage changes (login/logout in other tabs)
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                if (e.newValue) {
                    try {
                        setUser(JSON.parse(e.newValue));
                    } catch (error) {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
    <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand as={NavLink} to="/" style={{"color":'gold'}}>
                <FontAwesomeIcon icon ={faVideoSlash}/>Gold
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                        <NavLink className ="nav-link" to="/">Home</NavLink>
                        <NavLink className ="nav-link" to="/watchList">Watch List</NavLink>
                        <NavLink className ="nav-link" to="/favorites">Favorites</NavLink>
                    </Nav>
                    <div className="search-form">
                        <input 
                            type="text" 
                            placeholder="Search videos..." 
                            value={videoUrl} 
                            onChange={e => setVideoUrl(e.target.value)} 
                            onKeyPress={e => e.key === 'Enter' && handleSearch(e)}
                            className="search-input"
                        />
                        <Button variant="outline-info" className="search-button" onClick={handleSearch}>
                            <FontAwesomeIcon icon={faSearch} />
                        </Button>
                    </div>
                    <div className="user-menu">
                        {user ? (
                            <div className="user-menu-container">
                                <div className="user-profile-button">
                                    <div className="user-avatar">
                                        <FontAwesomeIcon icon={faUserCircle} />
                                    </div>
                                    <span className="user-name">{user.name || user.email}</span>
                                </div>
                                <div className="user-menu-dropdown">
                                    <NavLink to="/profile" className="dropdown-item">
                                        <FontAwesomeIcon icon={faUser} className="me-2" />
                                        Profile
                                    </NavLink>
                                    <NavLink to="/watchList" className="dropdown-item">
                                        <FontAwesomeIcon icon={faBookmark} className="me-2" />
                                        Watchlist
                                    </NavLink>
                                    <NavLink to="/favorites" className="dropdown-item">
                                        <FontAwesomeIcon icon={faHeart} className="me-2" />
                                        Favorites
                                    </NavLink>
                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout} className="dropdown-item logout-item">
                                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="user-menu-container">
                                <NavLink to="/login" className="login-button">
                                    <div className="login-icon">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    <span>Sign In</span>
                                </NavLink>
                                <div className="user-menu-dropdown">
                                    <NavLink to="/login" className="dropdown-item">
                                        <FontAwesomeIcon icon={faUser} className="me-2" />
                                        Sign In
                                    </NavLink>
                                    <NavLink to="/register" className="dropdown-item">
                                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                                        Create Account
                                    </NavLink>
                                </div>
                            </div>
                        )}
                    </div>
                </Navbar.Collapse>
        </Container>
    </Navbar>
  )
}

export default Header