import {useState, useMemo} from 'react'
import adList1 from './adList1.json';
import adList2 from './adList2.json';
import _ from 'lodash';
import './App.css'

function Tile({value, onClick}) {
    let bg = "";
    if (value === 'Boy') {
        bg = "#74b9ff";
    }
    if (value === 'Girl') {
        bg = "#fd79a8";
    }
    return (
        <button className="tile" style={{width: 100, height: 100, background: bg, margin: 4}} onClick={onClick}>
            {value}
        </button>
    );
}

function base3ToBase10(number) {
    let base10 = 0;
    const len = number.length;

    for (let i = 0; i < len; i++) {
        base10 += parseInt(number[i]) * Math.pow(3, len - i - 1);
    }

    return base10;
}

function Board({graph}) {
    const winners = ["-", "Boy", "Girl"]
    const [tiles, setTiles] = useState(Array(9).fill(null));
    // const [xIsNext, setXIsNext] = useState(true);

    const handleClick = (index) => {
        if (tiles[index] || calculateWinner(tiles)) {
            return;
        }
        const currentTiles = [...tiles];
        const currentBits = [];
        for (let i = 0; i < 9; i += 1) {
            currentBits.push(currentTiles[i] || '0');
        }
        const currentBase3 = currentBits.join("");
        const currentBase10 = base3ToBase10(currentBase3);
        const candidates = new Set(graph[currentBase10].children);
        const nextTiles1 = [...tiles];
        nextTiles1[index] = 1;
        const nextTiles2 = [...tiles];
        nextTiles2[index] = 2;
        const finalTiles = [...tiles];
        const bits1 = [];
        const bits2 = [];
        for (let i = 0; i < 9; i += 1) {
            bits1.push(nextTiles1[i] || '0');
            bits2.push(nextTiles2[i] || '0');
        }
        const next1Base3 = bits1.join("");
        const next1Base10 = base3ToBase10(next1Base3)
        const next2Base3 = bits2.join("");
        const next2Base10 = base3ToBase10(next2Base3)

        if (candidates.has(next1Base10) && candidates.has(next2Base10)) {
            finalTiles[index] = _.random(1, 2);
        } else if (candidates.has(next1Base10)) {
            finalTiles[index] = 1;
        } else if (candidates.has(next2Base10)) {
            finalTiles[index] = 2;
        }
        setTiles(finalTiles);
    };

    const renderTile = (index) => {
        return (
            <Tile
                value={winners[tiles[index]]}
                onClick={() => handleClick(index)}
            />
        );
    };

    const winner = calculateWinner(tiles);
    const status = `Winner: ${winner ? winners[winner] : "?"}`;

    return (
        <div>
            <div className="status" style={{fontWeight: 800}}>{status}</div>
            <div className="board"
                 style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <div className="row" style={{display: "flex"}}>
                    {renderTile(0)}
                    {renderTile(1)}
                    {renderTile(2)}
                </div>
                <div className="row" style={{display: "flex"}}>
                    {renderTile(3)}
                    {renderTile(4)}
                    {renderTile(5)}
                </div>
                <div className="row" style={{display: "flex"}}>
                    {renderTile(6)}
                    {renderTile(7)}
                    {renderTile(8)}
                </div>
            </div>
        </div>
    );
}

function calculateWinner(tiles) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
            return tiles[a];
        }
    }
    return null;
}


function App() {

    const outcomeForGraph = useMemo(() => {
        const map1 = {};
        const map2 = {};
        for (let i = 0; i <= 19683; i += 1) {
            map1[i] = {
                current: i,
                children: [],
            }
            map2[i] = {
                current: i,
                children: [],
            }
        }
        _.each(adList1, list => {
            const [left, right] = list;
            map1[left].children.push(right)
        })
        _.each(adList2, list => {
            const [left, right] = list;
            map2[left].children.push(right)
        })
        return {"1": map1, "2": map2}
    }, []);
    const [selectedOption, setSelectedOption] = useState("1");
    const [draw, setDraw] = useState(0);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    return (
        <div className="App">
            <div>
                <label>
                    <input
                        type="radio"
                        value="1"
                        checked={selectedOption === "1"}
                        onChange={handleOptionChange}
                    />
                    Boy
                </label>
                <label>
                    <input
                        type="radio"
                        value="2"
                        checked={selectedOption === "2"}
                        onChange={handleOptionChange}
                    />
                    Girl
                </label>
            </div>
            <header className="App-header">
                <h1>Tic Tac Toe</h1>
                <p>Three in a row, let's finally know! Tic Tac Toe reveals the gender's flow!</p>
                <Board key={selectedOption + draw} graph={outcomeForGraph[selectedOption]}/>
            </header>
            <button style={{marginTop: 8}} onClick={() => setDraw(s => s + 1)}>Clear</button>
        </div>
    );
}

export default App
