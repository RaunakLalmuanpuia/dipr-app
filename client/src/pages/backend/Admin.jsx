import { Link } from "react-router-dom";
import Users from '../../pages/backend/Users';
import MainCard from '../../components/cards/MainCard';

const Admin = () => {
    return (
        <MainCard title="Admin">
            <section>
                <h1>Admins Page</h1>
                <br />
                <Users />
                <br />
                <div className="flexGrow">
                    <Link to="/dashboard">Home</Link>
                </div>
            </section>
        </MainCard>
    )
}

export default Admin
