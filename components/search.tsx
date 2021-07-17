import React from 'react'
import { SVG } from '../svg'

export const Search = () => {
    const { search } = SVG
    return (
        <div className="mx-5 flex flex-row rounded-lg shadow-lg">
            <input id="search" type="search" name="search" placeholder="find products here..." className="w-full px-5 py-3 rounded-l-lg" />
            <button type="submit" className="px-3 bg-gray-400 text-white rounded-r-lg">{search}</button>
        </div>
    )
}
