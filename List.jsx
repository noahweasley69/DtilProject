import React, { useState, useEffect } from "react";

function List() {
    const [todo, settodo] = useState([]);
    const [items, setitems] = useState("");

    const [hours, sethours] = useState("");
    const [minutes, setminutes] = useState("");
    const [seconds, setseconds] = useState("");

    function adder() {
        const newTask = {
            text: items,
            hours: parseInt(hours) || 0,
            minutes: parseInt(minutes) || 0,
            seconds: parseInt(seconds) || 0,
            started: false,
            finished: false
        };
        settodo(t => [...t, newTask]);
        setitems("");
        sethours("");
        setminutes("");
        setseconds("");
    }

    function remover(index) {
        settodo(todo.filter((_, i) => i !== index));
    }

    function moveup(index) {
        if (index > 0) {
            const updatedtodo = [...todo];
            [updatedtodo[index], updatedtodo[index - 1]] = [updatedtodo[index - 1], updatedtodo[index]];
            settodo(updatedtodo);
        }
    }

    function movedown(index) {
        if (index < todo.length - 1) {
            const updatedtodo = [...todo];
            [updatedtodo[index], updatedtodo[index + 1]] = [updatedtodo[index + 1], updatedtodo[index]];
            settodo(updatedtodo);
        }
    }

    function startalarm(index) {
        settodo(prev => {
            const updated = [...prev];
            updated[index].started = true;
            updated[index].finished = false;
            return updated;
        });
    }

    useEffect(() => {
        const interval = setInterval(() => {
            settodo(prev => {
                return prev.map(task => {
                    if (!task.started || task.finished) return task;

                    let { hours, minutes, seconds } = task;

                    if (seconds > 0) {
                        seconds--;
                    } else if (minutes > 0) {
                        minutes--;
                        seconds = 59;
                    } else if (hours > 0) {
                        hours--;
                        minutes = 59;
                        seconds = 59;
                    } else {
                        task.finished = true;
                        task.started = false;
                        return { ...task };
                    }

                    return { ...task, hours, minutes, seconds };
                });
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div>
                <input type="text" placeholder="enter your task" value={items} onChange={(e) => setitems(e.target.value)} />
                <input type="text" placeholder="addhours" onChange={(e) => sethours(e.target.value)} value={hours} />
                <input type="text" placeholder="addminutes" onChange={(e) => setminutes(e.target.value)} value={minutes} />
                <input type="text" placeholder="addseconds" onChange={(e) => setseconds(e.target.value)} value={seconds} />
                <button onClick={adder}>Add to List</button>
            </div>

            <ul>
                {todo.map((to, index) => (
                    <div key={index}>
                        <li>
                            {to.text}{" "}
                            {to.finished
                                ? <span>⏰ Time's Up!</span>
                                : <span>{String(to.hours).padStart(2, '0')}:{String(to.minutes).padStart(2, '0')}:{String(to.seconds).padStart(2, '0')}</span>}
                        </li>
                        <button onClick={() => remover(index)}>Remove</button>
                        <button onClick={() => moveup(index)}>👆</button>
                        <button onClick={() => movedown(index)}>👇</button>
                        <button onClick={() => startalarm(index)}>Please click to start!</button>
                        <br />
                    </div>
                ))}
            </ul>
        </>
    );
}

export default List;