import React from "react";
import { useSelector } from "react-redux";
import Auth from "../auth/Auth";
import Playlist from "../player/Playlist";
import SearchBar from "../search/SearchBar";
import FavoritesGrid from "../player/FavoritesGrid";
import SongList from "../player/SongList";

import "../../css/mainArea/MainArea.css";

const MainArea = ({ view, songs, onSongSelect, searchTerm, setSearchTerm, onCategorySelect, selectedCategory, onSearch, searchHistory, onRemoveHistory }) => {
  const { user } = useSelector((state) => state.auth);

  const handleSongSelect = (index) => {
    // If in search view and we have a search term, save it to history when a song is clicked
    if (view === "search" && searchTerm && onSearch) {
      onSearch(searchTerm);
    }
    onSongSelect(index);
  };

  return (
    <div className="mainarea-root flex flex-col h-full min-h-0" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div className="mainarea-top">
        <Auth />
        {view === "home" && <Playlist onCategorySelect={onCategorySelect} selectedCategory={selectedCategory} />}
        {view === "search" && (
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={onSearch} />
        )}
      </div>

      <div className="mainarea-scroll flex-1 min-h-0 overflow-hidden" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {view === "favourite" ? (
          <FavoritesGrid songs={songs} onSongSelect={onSongSelect} />
        ) : view === "search" && !searchTerm ? (
          <div className="p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
            {searchHistory.length === 0 ? (
              <p className="text-gray-400 text-sm">No recent searches</p>
            ) : (
              <ul className="space-y-2">
                {searchHistory.map((term, index) => (
                  <li key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg hover:bg-white/10 transition group">
                    <span
                      className="cursor-pointer flex-1"
                      onClick={() => setSearchTerm(term)}
                    >
                      {term}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveHistory(term);
                      }}
                      className="text-gray-400 hover:text-red-500 transition px-2"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <SongList songs={songs} onSongSelect={handleSongSelect} />
        )}
      </div>
    </div>
  );
};

export default MainArea;
