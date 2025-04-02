import React from 'react'
import Carousel from './Carousel.jsx'

export default function Home() {
    return (
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <Carousel/>
            <h1 style={{marginTop: 0}}>This is SciArt</h1>
        </div>
    )
}