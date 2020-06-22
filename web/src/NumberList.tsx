import React from 'react';

interface Props {
    numbers: number[];
}

class NumberList extends React.Component<Props, {}> {

    render() {
        return (
            <>
            <h3>{this.props.children}</h3>
            <ul>{this.props.numbers.map(number => 
                <li key={number.toString()}>
                    {number}
                </li>
            )}
            </ul>
            </>
        )
    }
    
}

export default NumberList;

// function NumberList(props: Props) {
//     const {numbers} = props;
   
//     return (
//         <ul>{numbers.map(number => 
//             <li key={number.toString()}>
//                 {number}
//             </li>
//         )}
//         </ul>
//     )
// }

// export default NumberList;

// interface Props {
//     numbers: number[];
// }

// const NumberList: React.FC<Props> = ({numbers}) => {
//     const listItems = numbers.map(number => 
//         <li key={number.toString()}>
//             {number}
//         </li>
//     )

//     return (
//         <ul>{listItems}</ul>
//     )
// }

// export default NumberList;

// interface Props {
//     numbers: number[];
// }

// function NumberList(props: Props) {
//     const {numbers} = props;
//     const listItems = numbers.map(number => 
//         <li key={number.toString()}>
//             {number}
//         </li>
//     )

//     return (
//         <ul>{listItems}</ul>
//     )
// }

// export default NumberList;




// function NumberList(props: any) {
//     const {numbers} = props;
//     const listItems = numbers.map((number: number) => 
//         <li key={number.toString()}>
//             {number}
//         </li>
//     )

//     return (
//         <ul>{listItems}</ul>
//     )
// }

// export default NumberList;