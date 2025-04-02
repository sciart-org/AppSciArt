export default function AppNavbar() {
    return (
        <div id='navbar'>
            <div className="left-button-container">
                <button>button1</button>
                <button>button2</button>
                <button>button3</button>
            </div> 
            <h2 style={{textAlign: 'center'}}>
                AppSciArt
            </h2>
            <div className="right-button-container">
                <button>button1</button>
                <button>button2</button>
                <button>button3</button>
            </div>
        </div>
    )
}