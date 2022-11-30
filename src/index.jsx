// const fs = require('fs');
import {h, Fragment, render} from 'preact';
import DocBlock from 'docblock';
import {useCallback, useEffect, useState} from "preact/hooks";

(() => {
    // const source = fs.readFileSync('./test.fusion');
    const input = document.getElementById('input');
    const docBlock = new DocBlock();
    const output = document.getElementById('output');
    const example = document.getElementById('example');

    const Tag = ({name, value}) => {
        return (
            <Fragment>
                <dt className="font-bold">{name}</dt>
                <dd>{value}</dd>
            </Fragment>
        )
    };

    const Example = ({example}) => {
        return (
            <section>
                <header dangerouslySetInnerHTML={{ __html: example.title }}></header>
                <pre className="bg-slate-100 p-4 rounded">
                    <code className="language-jsx">{example.content}</code>
                </pre>
            </section>
        )
    };

    const App = () => {
        const [docBlocks, setDocBlocks] = useState([]);

        const handleChange = useCallback((e) => {
            console.log('handleChange', e.target.value);

            const result = docBlock.parse(e.target.value, 'js');
            output.value = JSON.stringify(result, null, 4);
            setDocBlocks(result);
        }, []);

        useEffect(() => {
            input.addEventListener('change', handleChange);
            input.dispatchEvent(new Event('change'));

            return () => {
                input.removeEventListener('change', handleChange);
            }
        }, []);

        console.debug('Started app and rendering');

        return (
            <div className="flex flex-col gap-4">
                {docBlocks.map((docBlock) => (
                    <section key={docBlock.pos} className="w-full border p-4 rounded">
                        <header>
                            <h3 className="text font-bold">{docBlock.title}</h3>
                        </header>
                        <p dangerouslySetInnerHTML={{ __html: docBlock.description }}></p>
                        {docBlock.tags && !docBlock.tags.ignore && (
                            <Fragment>
                                <hr className="my-4"/>
                                <h4 className="font-bold">Tags:</h4>
                                <dl className="grid grid-cols-2 gap-4 max-w-fit">
                                    {docBlock.tags.returns && (
                                        <Tag name="Returns" value={docBlock.tags.returns.description}/>
                                    )}
                                    {docBlock.tags.isPublic && (
                                        <Tag name="Is public" value="True"/>
                                    )}
                                    {docBlock.tags.isPrivate && (
                                        <Tag name="Is private" value="True"/>
                                    )}
                                    {docBlock.tags.isDeprecated && (
                                        <Tag name="Is deprecated" value="True"/>
                                    )}
                                    {docBlock.tags.presentation !== undefined && (
                                        <Tag name="Is presentational" value="True"/>
                                    )}
                                    {docBlock.tags.integration !== undefined && (
                                        <Tag name="Is integrational" value="True"/>
                                    )}
                                </dl>
                                {docBlock.tags.params && (
                                    <Fragment>
                                        <hr className="my-4"/>
                                        <h4 className="font-bold">Props:</h4>
                                        <table className="border-separate border-spacing-2 border border-slate-500">
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            {docBlock.tags.params.map((param) => (
                                                <tr>
                                                    <td>{param.name || param.description}</td>
                                                    <td>{param.type}</td>
                                                    <td dangerouslySetInnerHTML={{__html: param.name ? param.description : ''}}></td>
                                                </tr>
                                            ))}
                                        </table>
                                    </Fragment>
                                )}
                                {docBlock.tags.examples && (
                                    <Fragment>
                                        <hr className="my-4"/>
                                        <h4 className="font-bold">Examples:</h4>
                                        {docBlock.tags.examples.map((example) => (
                                            <Example example={example} />
                                        ))}
                                    </Fragment>
                                )}
                            </Fragment>
                        )}
                    </section>
                ))}
            </div>
        );
    }

    example.innerHTML = '';
    render(<App/>, example);

    console.log('Finished');
})();
