import { Link } from "react-router-dom"
import MainCard from "../../components/cards/MainCard.jsx";

const Editor = () => {
    return (
        <MainCard title="Editor">
        <section>
            <h1>Editors Page</h1>
            <br />
            <p>You must have been assigned an Editor role.</p>
            <div className="flexGrow">
                <Link to="/dashboard">Home</Link>
            </div>
        </section>
        </MainCard>
    )
}

export default Editor
