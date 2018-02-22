module.exports = function solveSudoku(matrix) {
    const temp = [1,2,3,4,5,6,7,8,9];

    for(let i = 0; i < 9; i++) {
        let column = [];
        matrix[i] = matrix[i].map( (n, i, arr) => n === 0 
            ? (
                n = temp.filter( item => !arr.includes(item)),
                column = matrix.map(row => row[i]),
                n = n.filter( item => !column.includes(item)),
                n = n.length === 1 ? n[0] : n
            )
            : n
        )
    }
    
    return matrix;
}
