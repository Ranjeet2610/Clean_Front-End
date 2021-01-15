import React,{Component} from 'react';

export default class Pagination extends Component {
    constructor(props){
        super(props);
        this.state = {
            bgColor:'',
            textColor:'black',
            activeIndex:0
        }
    }

    handleBackGr = (index) => {
        this.setState({
            bgColor:'#6c1945',
            textColor:"#fff",
            activeIndex:index
        })
    }

    render(){
        const pageNumbers = [];

        for(let i = 1; i <= Math.ceil(this.props.totalPosts / this.props.postsPerPage); i++){
            pageNumbers.push(i);
        }
        return(
            <nav>
                <ul className="pagination">
                    {
                        pageNumbers.map((number,index) => (
                            this.state.activeIndex===index ?
                            <li key={number} className="page-item" onClick={() => this.handleBackGr(index)}>
                                {
                                    this.state.activeIndex===index ?
                                    <a onClick={() => {this.props.paginate(number)}} className="page-link" style={{backgroundColor:'#6c1945', color:'#fff'}}>
                                        {number}
                                    </a>:
                                    <a onClick={() => {this.props.paginate(number)}} className="page-link">
                                        {number}
                                    </a>
                                }
                            </li>:
                            <li key={number} className="page-item" onClick={() => this.handleBackGr(index)}>
                                {
                                    this.state.activeIndex===index ?
                                    <a onClick={() => {this.props.paginate(number)}} className="page-link" style={{backgroundColor:this.state.bgColor, color:this.state.textColor}}>
                                        {number}
                                    </a>:
                                    <a onClick={() => {this.props.paginate(number)}} className="page-link">
                                        {number}
                                    </a>
                                }
                            </li>
                        ))
                    }
                </ul>
            </nav>
        )
    }
}