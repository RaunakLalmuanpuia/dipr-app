import { Link } from "react-router-dom"
import MainCard from "../../components/cards/MainCard.jsx";
const Lounge = () => {
    return (
        <MainCard title="Lounge">
        <section>
            <h1>The Lounge</h1>
            <br />
            <p>Admins and Editors can hang out here.</p>
            <div className="flexGrow">
                <Link to="/dashboard">Home</Link>
            </div>
        </section>
        </MainCard>
    )
}

export default Lounge
