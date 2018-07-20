import App from './App';
import { connect } from 'react-redux';
import { setActiveApp } from './app.actions';

const mapStateToProps = ({ app: { activeApp } }) => ({
    activeApp
});

const mapDispatchToProps = dispatch => ({
    setActiveApp: app => {dispatch(setActiveApp(app))}
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
