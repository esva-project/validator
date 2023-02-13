import React, { Component } from "react";

import Dropzone from "react-dropzone";

export default class MyDropzone extends Component {
	fileInputted = (files) => {
		const sizes = ["TB", "GB", "MB", "KB", "B"];
		files.forEach((fileIterator) => {
			const reader = new FileReader();
			reader.onload = () => {
				var sizesCount = sizes.length;
				var size = fileIterator.size;
				while (sizesCount-- && size > 1024) {
					size /= 1024;
				}
				const formData = new FormData();
				formData.append("file", fileIterator);
				const file = {
					name: fileIterator.name,
					size: `${Math.round(size * 100) / 100} ${sizes[sizesCount]}`,
					file: reader.result,
					formData,
				};
				this.props.onInputFile({ file });
			};
			reader.readAsDataURL(fileIterator);
		});
	};

	render() {
		return (
			<Dropzone accept={["application/pdf", "text/xml"]} onDrop={this.fileInputted}>
				{({ getRootProps, getInputProps }) => (
					<section className="w-100 h-100">
						<div {...getRootProps({ className: "w-100 h-100", style: { overflow: "hidden" } })}>
							<input {...getInputProps()} ref={this.props.inputFileRef} />
							{this.props.children}
						</div>
					</section>
				)}
			</Dropzone>
		);
	}
}
