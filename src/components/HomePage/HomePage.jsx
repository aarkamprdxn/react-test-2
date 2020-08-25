import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { userActions } from '../../actions';
import './HomePage.css';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
    
        document.title = "React Test | Home";
    
        this.state = {
          error: null,
          isLoaded: false,
          data: [],
          showData: 20
        }
    }

    componentDidMount() {
        this.props.getUsers();

        // Axios
        axios.get('https://jsonplaceholder.typicode.com/photos')
        .then(
        (res) => {
            this.setState({
            isLoaded: true,
            data: res.data
            });
        },
        (error) => {
            this.setState({
            isLoaded: true,
            error
            });
        }
        )
    }


    render() {
        const { user, users } = this.props;
        const { error, isLoaded, data, showData } = this.state; 
        if (error) {
            return <h3 className="error-msg">Error: {error.message}</h3>;
            }
        else {
        return (
            <div className="home">
                <h1>Welcome <span>{user.firstName}!!</span></h1>
                <Router>
                <div>
                    <p>Images</p>
                    <ul>
                    {data.slice(0, showData).map(item => (
                        <li key={item.id}>
                        <div className="img-content">
                            <span className="img-id">{item.id}</span>
                            <Link to={`/image/${item.id}`}>
                            <img className="img" src={item.thumbnailUrl} />
                            </Link>
                        </div>
                        </li>
                    ))}
                    </ul>
                    <Switch>
                    <Route path="/image/:id" children={
                        <SelectedImage data={this.state.data} />
                    } />
                    </Switch>
                </div>
                </Router>
                <p className="logout-button"> <Link to="/login" className="btn">Logout</Link> </p>
            </div>
            );
        }
    }
}
const SelectedImage = (props) => {
    let { id } = useParams();
    let { data } = props;
    const showData = 20;
    let imageUrl;
  
    data.slice(0, showData).map(item => (
      Number(id) === item.id ? imageUrl = item.url : null
    ));
  
    return (
      <div className="selected">
        <div className="selected-image">
          <h3>Selected Image</h3>
          <img src={imageUrl} />
          <p className="remove"><Link to="/" title="Remove" className="btn">Remove</Link></p>
        </div>
      </div>
    );
  }

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };