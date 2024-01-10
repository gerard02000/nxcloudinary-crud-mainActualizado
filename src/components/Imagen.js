import { dragOverHandler, dropHandler } from '@/lib/drag-drop'

function Imagen({ children, img }) {
    return (
        <form id="preview" >
            <img
                id='imgPreview'
                src={img}
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                style={{
                    display: 'block',
                    aspectRatio: 1.62,
                    width: '324px',
                    height: '200px',
                    objectFit: 'cover',
                    objectPosition: 'center'
                }} />

            {children}
        </form>

    )
}

export default Imagen