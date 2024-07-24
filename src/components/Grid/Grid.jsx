import React, { useState, useEffect, useRef } from 'react'
import {getGrid} from '../../utils/startingGrid'
import './Grid.css'
import {useParams} from '../../context/context'

export default function Grid() {
    const {grid, setGrid, editing, setEditFlag, mode, start, end, run, res, algo} = useParams();

    const [refArray, mm] = useState(getRefArray(grid));

    function getRefArray(grid) {
        let array = [];
        grid.forEach((elem) => {
            elem.forEach((child) => {
                array.push(useRef());
            })
        })
        return array;
    }

    function BFS(graph, hashmap, prevmap, start, target) {
        let queue = [start];
        let count = 0;
        hashmap[`${start.x}-${start.y}`] = true;
        while (queue.length > 0) {
            count += 1;
            let c = queue.pop();
            refArray[c.x + c.y * 50].current.style['transition-delay'] = `${count * 8}ms`;
            refArray[c.x + c.y * 50].current.classList.add('visited');
            if (c.x === target.x && c.y === target.y) return [c, count];

            if (c.x + 1 < 50 && !hashmap[`${c.x + 1}-${c.y}`] && !graph[c.y][c.x + 1].isWall) {
                queue.unshift({ x: c.x + 1, y: c.y });
                prevmap[`${c.x + 1}-${c.y}`] = { ...c };
                hashmap[`${c.x + 1}-${c.y}`] = true;
            }
            if (c.x - 1 >= 0 && !hashmap[`${c.x - 1}-${c.y}`] && !graph[c.y][c.x - 1].isWall) {
                queue.unshift({ x: c.x - 1, y: c.y });
                prevmap[`${c.x - 1}-${c.y}`] = { ...c };
                hashmap[`${c.x - 1}-${c.y}`] = true;
            }
            if (c.y + 1 < 25 && !hashmap[`${c.x}-${c.y + 1}`] && !graph[c.y + 1][c.x].isWall) {
                queue.unshift({ x: c.x, y: c.y + 1 });
                prevmap[`${c.x}-${c.y + 1}`] = { ...c };
                hashmap[`${c.x}-${c.y + 1}`] = true;
            }
            if (c.y - 1 >= 0 && !hashmap[`${c.x}-${c.y - 1}`] && !graph[c.y - 1][c.x].isWall) {
                queue.unshift({ x: c.x, y: c.y - 1 });
                prevmap[`${c.x}-${c.y - 1}`] = { ...c };
                hashmap[`${c.x}-${c.y - 1}`] = true;
            }
        }
        return null;
    }


    function BDS(graph, hashmap, prevmap, start, target) {
        let queue = [start];
        let count = 0;
        hashmap[`${start.x}-${start.y}`] = true;
        while (queue.length > 0) {
            count += 1;
            let c = queue[0];
            queue.shift();
            refArray[c.x + c.y * 50].current.style['transition-delay'] = `${count * 8}ms`;
            refArray[c.x + c.y * 50].current.classList.add('visited');
            if (c.x === target.x && c.y === target.y) return [c, count];

            if (c.y + 1 < 25 && !hashmap[`${c.x}-${c.y + 1}`] && !graph[c.y + 1][c.x].isWall) {
                queue.unshift({ x: c.x, y: c.y + 1 });
                prevmap[`${c.x}-${c.y + 1}`] = { ...c };
                hashmap[`${c.x}-${c.y + 1}`] = true;
            }
            if (c.x - 1 >= 0 && !hashmap[`${c.x - 1}-${c.y}`] && !graph[c.y][c.x - 1].isWall) {
                queue.unshift({ x: c.x - 1, y: c.y });
                prevmap[`${c.x - 1}-${c.y}`] = { ...c };
                hashmap[`${c.x - 1}-${c.y}`] = true;
            }
            if (c.y - 1 >= 0 && !hashmap[`${c.x}-${c.y - 1}`] && !graph[c.y - 1][c.x].isWall) {
                queue.unshift({ x: c.x, y: c.y - 1 });
                prevmap[`${c.x}-${c.y - 1}`] = { ...c };
                hashmap[`${c.x}-${c.y - 1}`] = true;
            }
            if (c.x + 1 < 50 && !hashmap[`${c.x + 1}-${c.y}`] && !graph[c.y][c.x + 1].isWall) {
                queue.unshift({ x: c.x + 1, y: c.y });
                prevmap[`${c.x + 1}-${c.y}`] = { ...c };
                hashmap[`${c.x + 1}-${c.y}`] = true;
            }
        }
        return null;
    }

    function Dijkstra(graph, hashmap, prevmap, start, target) {
        let queue = [start];
        let count = 0;
        let distance = {};
        hashmap[`${start.x}-${start.y}`] = true;
    
        for (let j = 0; j < 25; j++) {
            for (let i = 0; i < 50; i++) {
                distance[`${i}-${j}`] = Infinity;
            }
        }
        distance[`${start.x}-${start.y}`] = 0;
    
        while (queue.length > 0) {
            count += 1;
            let c = queue.shift();
            refArray[c.x + c.y * 50].current.style['transition-delay'] = `${count * 8}ms`;
            refArray[c.x + c.y * 50].current.classList.add('visited');
    
            if (c.x === target.x && c.y === target.y) return [c, count];
    
            let neighbors = [
                { x: c.x + 1, y: c.y },
                { x: c.x - 1, y: c.y },
                { x: c.x, y: c.y + 1 },
                { x: c.x, y: c.y - 1 }
            ];
    
            neighbors.forEach(neighbor => {
                if (
                    neighbor.x >= 0 && neighbor.x < 50 &&
                    neighbor.y >= 0 && neighbor.y < 25 &&
                    !hashmap[`${neighbor.x}-${neighbor.y}`] &&
                    !graph[neighbor.y][neighbor.x].isWall
                ) {
                    let alt = distance[`${c.x}-${c.y}`] + graph[neighbor.y][neighbor.x].weight;
                    if (alt < distance[`${neighbor.x}-${neighbor.y}`]) {
                        distance[`${neighbor.x}-${neighbor.y}`] = alt;
                        prevmap[`${neighbor.x}-${neighbor.y}`] = { ...c };
                        hashmap[`${neighbor.x}-${neighbor.y}`] = true;
                        queue.unshift({ x: neighbor.x, y: neighbor.y });
                    }
                }
            });
    
            queue.sort((a, b) => distance[`${a.x}-${a.y}`] - distance[`${b.x}-${b.y}`]);
        }
        return null;
    }

    useEffect(() => {
        if (algo == 'BFS') {
            let hashmap = {};
            let prevmap = {};
            for (let j = 0; j < 25; j++) {
                for (let i = 0; i < 50; i++) {
                    hashmap[`${i}-${j}`] = false;
                    prevmap[`${i}-${j}`] = null;
                }
            }

            let result = BFS(grid, hashmap, prevmap, start.current, end.current);
            let path = [];
            if (result != null) {
                let current = result[0];
                while (prevmap[`${current.x}-${current.y}`] != null) {
                    path.push(current);
                    current = prevmap[`${current.x}-${current.y}`];
                }
                setTimeout(() => {path.reverse().forEach((elem, index) => {
                    refArray[elem.x + elem.y * 50].current.style['transition-delay'] = `${(index) * 15} ms`;
                    refArray[elem.x + elem.y * 50].current.classList.add('path');
                })}, result[1] * 9)
            }
        }

        if (algo == 'BDS') {
            let hashmap = {};
            let prevmap = {};
            for (let j = 0; j < 25; j++) {
                for (let i = 0; i < 50; i++) {
                    hashmap[`${i}-${j}`] = false;
                    prevmap[`${i}-${j}`] = null;
                }
            }

            let result = BDS(grid, hashmap, prevmap, start.current, end.current);
            let path = [];
            if (result != null) {
                let current = result[0];
                while (prevmap[`${current.x}-${current.y}`] != null) {
                    path.push(current);
                    current = prevmap[`${current.x}-${current.y}`];
                }
                setTimeout(() => {path.reverse().forEach((elem, index) => {
                    refArray[elem.x + elem.y * 50].current.style['transition-delay'] = `${(index) * 15} ms`;
                    refArray[elem.x + elem.y * 50].current.classList.add('path');
                })}, result[1] * 9)
            }
        }

        if (algo == 'Dijkstra') {
            let hashmap = {};
            let prevmap = {};
            for (let j = 0; j < 25; j++) {
                for (let i = 0; i < 50; i++) {
                    hashmap[`${i}-${j}`] = false;
                    prevmap[`${i}-${j}`] = null;
                }
            }

            let result = Dijkstra(grid, hashmap, prevmap, start.current, end.current);
            let path = [];
            if (result != null) {
                let current = result[0];
                while (prevmap[`${current.x}-${current.y}`] != null) {
                    path.push(current);
                    current = prevmap = prevmap[`${current.x}-${current.y}`];
                }
                setTimeout(() => {path.reverse().forEach((elem, index) => {
                    refArray[elem.x + elem.y * 50].current.style['transition-delay'] = `${(index) * 15} ms`;
                    refArray[elem.x + elem.y * 50].current.classList.add('path');
                })}, result[1] * 9)
            }
        }
    }, [run])

    useEffect(() => {
        refArray.forEach((elem) => {elem.current.style['transition-delay'] = '0ms'});
        refArray.forEach((elem) => {elem.current.classList.remove('visited'); elem.current.classList.remove('path')});
    }, [res])

    return (
        <div className = 'board'>
            {refArray.map((elem, index) => {
                let classList = ['cell'];

                let yIndex = Math.floor(index/50);
                let xIndex = index % 50;
                let cell = grid[yIndex][xIndex];

                if (cell.isWall) {
                    classList.push('wall');
                }

                return <div key = {`${index}`} ref = {elem} className = {classList.join(' ')}
                    onMouseDown = {() => {setEditFlag(true)}}
                    onMouseUp = {() => {setEditFlag(false)}}
                    onMouseMove = {() => {
                        if (!editing) return;
                        const current = grid[yIndex][xIndex];
                        if (current.isStart || current.isTarget) return;
                        switch(mode) {
                            case 'setStart': 
                                var newGrid = grid.map((elem) => {
                                    return elem.map((elem) => {
                                        if (!elem.isStart) return elem;
                                        return {...elem, isStart: false};
                                    })
                                })
                                newGrid[yIndex][xIndex] = {...newGrid[yIndex][xIndex], isStart: true, isTarget: false, weight: 1, isWall: false}
                                start.current = {x: xIndex, y: yIndex}
                                setGrid(newGrid);
                                break;

                            case 'setTarget': 
                                var newGrid = grid.map((elem) => {
                                    return elem.map((elem) => {
                                        if (!elem.isTarget) return elem;
                                        return {...elem, isTarget: false};
                                    })
                                })
                                newGrid[yIndex][xIndex] = {...newGrid[yIndex][xIndex], isStart: false, isTarget: true, weight: 1, isWall: false}
                                end.current = {x: xIndex, y: yIndex}
                                setGrid(newGrid);
                                break;

                            case 'addBricks':
                                var newGrid = grid.slice();
                                newGrid[yIndex][xIndex] = {...newGrid[yIndex][xIndex], weight: 1, isWall: true}
                                setGrid(newGrid);
                                break;

                            case 'addWeight':
                                var newGrid = grid.slice();
                                newGrid[yIndex][xIndex] = {...newGrid[yIndex][xIndex], weight: 5, isWall: false}
                                setGrid(newGrid);
                                break;

                        default: 
                            return;
                        }}}>

                    {cell.weight > 1 ? <i className = "bi bi-virus"></i> : null}
                    {cell.isStart ? <i className = "bi bi-geo-alt"></i> : null}
                    {cell.isTarget ? <i className = "bi bi-geo"></i> : null}
                </div>
            })}
        </div>
    )
}