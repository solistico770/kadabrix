import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';

const Page = ({ searchState, setSearchState }) => {
    const [words, setWords] = useState([]);
    const currentWords = searchState?.split(' ').filter(Boolean) || [];

    useEffect(() => {
        const fetchWords = async () => {
            const data = await kdb.run({
                "module": "repCatalog",
                "name": "getWords",
                "data": {
                    searchTerm: searchState
                }
            });
            setWords(data);
        };
        fetchWords();
    }, [searchState]);

    const handleWordClick = (word) => {
        if (currentWords.includes(word)) {
            const newSearchState = searchState
                .split(' ')
                .filter(w => w !== word)
                .join(' ');
            setSearchState(newSearchState);
        } else {
            // Check if we're in the middle of typing a word
            const lastSpaceIndex = searchState?.lastIndexOf(' ') ?? -1;
            const currentTyping = searchState?.slice(lastSpaceIndex + 1);

            if (currentTyping && word.startsWith(currentTyping)) {
                // Replace the partial word with the full word
                const beforePartial = searchState.slice(0, lastSpaceIndex + 1);
                setSearchState(beforePartial + word + ' ');
            } else {
                // Normal case - add the word
                setSearchState((prev) => prev ? `${prev}${word} ` : `${word} `);
            }
        }
    };

    return (
        <div className="flex flex-wrap gap-2 p-4">
            {words.map((item, index) => {
                const isSelected = currentWords.includes(item.word);
                return (
                    <button
                        key={index}
                        onClick={() => handleWordClick(item.word)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                            isSelected 
                            ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                            : 'bg-blue-100 hover:bg-blue-200'
                        }`}
                    >
                        {item.word}({item.frequency})
                    </button>
                );
            })}
        </div>
    );
};

export default Page;