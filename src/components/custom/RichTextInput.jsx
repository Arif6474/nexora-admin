import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["link"],
    // [{ size: [] }],
    ["clean"],
  ],
};

export const RichTextInput = ({
  label,
  name,
  control,
  errors,
  required,
  placeholder,
}) => {
  return (
    <div className="input_group">
      <label className="input_field_label caption bold">{label}</label>

      <div className="input_field_input body regular" style={{ padding: 0 }}>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          rules={{ required: required ? "This field is required" : false }}
          render={({ field: { onChange, value } }) => (
            <ReactQuill
              theme="snow"
              value={value || ""}
              onChange={onChange}
              modules={modules}
              placeholder={placeholder}
              style={{
                height: "350px",
                borderRadius: "0.5rem",
                overflow: "auto",
              }}
            />
          )}
        />
      </div>

      {errors && errors[name] && (
        <span className="error-message">{errors[name]?.message}</span>
      )}
    </div>
  );
};
