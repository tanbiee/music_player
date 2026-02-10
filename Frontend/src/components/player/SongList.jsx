import "../../css/mainArea/SongList.css";

const SongList = ({ songs, onSongSelect }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="songlist-root">
        <div className="songlist-empty flex flex-col items-center justify-center text-center gap-2 h-[260px] w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="songlist-empty-text text-lg font-semibold">🎵 No songs found</p>
          <span className="songlist-empty-subtext text-sm">
            Try searching with a different keyword
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="songlist-root">
      <div className="songlist-scroll">
        {songs.length === 0 && (
          <p className="searchbar-empty">Search songs to display 🎧</p>
        )}

        <table className="songlist-table">
          <colgroup>
            <col className="col-index" />
            <col className="col-name" />
            <col className="col-artist" />
            <col className="col-year" />
            <col className="col-duration" />
          </colgroup>

          <thead>
            <tr>
              <th className="songlist-th th-index">No</th>
              <th className="songlist-th">Name</th>
              <th className="songlist-th">Artist</th>
              <th className="songlist-th">Year</th>
              <th className="songlist-th th-duration">Duration</th>
            </tr>
          </thead>

          <tbody>
            {songs.map((song, index) => (
              <tr
                key={song.id}
                className="songlist-row"
                onClick={() => onSongSelect(index)}
              >
                <td className="songlist-td td-index">{index + 1}</td>
                <td className="songlist-td">{song.name}</td>
                <td className="songlist-td">{song.artist_name}</td>
                <td className="songlist-td">{song.releasedate}</td>
                <td className="songlist-td td-duration">{song.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongList;
