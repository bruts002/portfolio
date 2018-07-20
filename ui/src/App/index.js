import App from './App';
import { connect } from 'react-redux';
import { setActiveApp } from './app.actions';
import { withRouter } from 'react-router-dom'

const mapStateToProps = ({ app: { activeApp } }) => ({
    activeApp
});

const mapDispatchToProps = dispatch => ({
    setActiveApp: app => {dispatch(setActiveApp(app))}
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(App)
);
