import React from 'react';

var Latex = require('react-latex');

var Expressions = React.createClass({
    getInitialState: function() {
        return { 
            expressions: this.loadExpressions(),
        }
    },
    loadExpressions: function() {
        var expressions = [
            '$ a_{1} $',
            '$ \\frac{a}{b} $',
            '$ \\overline{x}  $',
            '$ \\sqrt{x} $',
            '$ x^{y} $',
            '$ \\bar{a} $',
            '$ \\hat{a} $',
            '$ \\alpha $',
            '$ \\beta $',
            '$ \\gamma $',
            '$ \\delta $',
            '$ \\eta $',
            '$ \\theta $',
            '$ \\pi $',
            '$ \\Sigma $',
            '$ \\Psi $',
            '$ \\lim_{x \\rightarrow 0} $',
            '$ \\sum_{i=1}^{n} \\quad $',
            '$ \\int_{0}^{\\pi} \\quad $',
            '$ \\oplus $',
            '$ \\otimes $',
            '$ \\odot $',
            '$ \\neq $',
        ]
        return expressions;
    },
    addExpression : function(expression) {
        let id = this.props.areaID;
        var el = document.getElementById(id)
        var start = el.selectionStart;
        var end = el.selectionEnd;
        var text = el.value;
        var before = text.substring(0, start);
        var after  = text.substring(end, text.length);
        el.value = before + expression + after;
        el.selectionStart = el.selectionEnd = start + expression.length;
        el.focus();
        this.props.onType();
    },
    render : function () {
        let self = this;
        return (
            <div className="margin3">
                {
                    (this.state.expressions).map( function(expression, index) { 
                        let key = "expression" + index;
                        return (
                            <button key={key} className="btn btn-default" onClick={() => self.addExpression(expression)} ><Latex>{expression}</Latex></button>
                        )
                    })
                }
                <button key="expressionEnter" className="btn btn-default" onClick={() => self.addExpression("<end>")} >Enter</button>
            </div>      
        )
    }
}); 

export default Expressions;