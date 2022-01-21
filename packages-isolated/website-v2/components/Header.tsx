import {NextPage} from "next";

const Header: NextPage = () => {
    return <header style={{
        background: '#ccc',
        width: '100%',
        display: 'flex',
        flex: '1',
        flexDirection: 'row',
        padding: '1em',
    }}>
        <h1 style={{marginTop: '0', marginBottom: '0', flex: 'auto 0 1', marginRight: '1em'}}>Polar</h1>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1em'}}>
            <div>documentation</div>
            <div>blog</div>
            <div>download</div>
            <div>extension</div>
        </div>
    </header>
}

export default Header;
