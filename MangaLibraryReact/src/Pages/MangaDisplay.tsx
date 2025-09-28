export default function MangaDisplay() {
    return (
        <div className="mangaDisplayContent">
            <img className="coverImage" src="test.jpg" alt="noimage.png"/>
            <h2 className="mangaTitleEnglish">To your Eternity</h2>
            <h3 className="mangaTitleNative">ベルセルク</h3>
            <p className="description">Everyone faces uncertainty at some point in their lives. Even a brilliant surgeon like Kenzo Tenma is no exception. But there’s no way he could have known that his decision to stop chasing professional success and instead concentrate on his oath to save peoples’ lives would result in the birth of an abomination. The questions of good and evil now take on a terrifyingly real dimension.\n<br></br>\nYears later, in Germany during the tumultuous post-reunification period, middle-aged childless couples are being killed one after another. The serial killer’s identity is known. The reasons why he kills are not. Dr. Tenma sets out on a journey to find the killer’s twin sister, who may hold some clues to solving the enigma of the “Monster.”\n<br></br>\n(Source: Viz Media)",</p>
            <ul className="genres">
                <li>Action</li>
                <li>Drama</li>
                <li>Mystery</li>
            </ul>
            <ul className="staff">
                <li>
                    <p className="staffName">Naoki Urasawa</p>
                    <p className="staffRole">Story & Art</p>
                </li>
            </ul>
        </div>
    );
}
