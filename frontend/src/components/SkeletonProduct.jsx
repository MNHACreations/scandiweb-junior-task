import React from 'react'

export default class SkeletonProduct extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let skeletonsToReturn = [];

        for (let i = 0; i < this.props.skeletons; i++) {
            skeletonsToReturn.push(

                <div   data-testid={`skeleton`}  
                className="  pb-[5px] self-center justify-end transition-all duration-[350ms] ease-in
                hover:drop-shadow-xl
                w-[18rem] h-[23rem] flex flex-col hover:bg-white hover:shadow-white ">
                <img className="w-64 max-h-64 rounded-2xl image-skeleton skeleton w-64 h-48 relative left-4 bottom-12"></img>
                <div className="product-meta">
                <p className="product-name font-roboto font-normal skeleton h-4 w-48"></p>
                <p className="product-price font-raleway font-extrabold skeleton skeleton-text   h-4 w-28 "></p>

                </div>


                <button className=" transition-all active:bg-green-600  border-transparent absolute  rounded-full w-14 h-14 bg-green-400  skeleton relative left-56 bottom-28">
                </button>
                </div>
            );
        }
        return skeletonsToReturn;

    };
}
