import notFoundImage from '../assets/coolPick.jfif'
const notFound = () => {
    return (
        <div>
            <h1>404 not found</h1>
            <img 
                src={notFoundImage} 
                    alt="coolPick" 
                    style={{ maxWidth: '100%', height: 'auto', marginTop: '20px', borderRadius: '8px' }} 
                />
        </div>
    )
}

export default notFound