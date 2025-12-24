import {memo, ReactNode, useMemo} from "react";
import {IUploaderAnswer, IUploaderData} from "jodit/types/types/uploader";
import {Control, Controller, UseFormSetValue} from "react-hook-form";
import {Danger} from "@/components/atoms/danger";
import JoditEditor from "jodit-react";

type props = {
  name: string;
  setValue: UseFormSetValue<any>,
  control?: Control<any>,
  isUploader?: boolean;
  minHeight?: string;
}

const Editor = ({name, setValue, isUploader = true, control, minHeight}: props) => {

  const config = useMemo(() => ({
    readonly: false,
    width: "100%",
    height: "100%",
    minHeight: minHeight,
    placeholder: '',
    buttons: [
      "bold",
      "italic",
      "underline",
      "fontsize",
      isUploader ? "image" : "|",
      "left",
      "center",
      "right",
      "justify",
      "undo",
      "redo",
    ],
    popup: {
      img: false
    },
    addNewLine: false,
    statusbar: false,
    toolbarAdaptive: false,
    allowResizeX: false,
    allowResizeY: false,
    uploader: {
      url: `${(import.meta.env.PROD) ? import.meta.env.VITE_BASE_URL : import.meta.env.VITE_LOCAL_BASE_URL}/admin/api/v1/file`,
      insertImageAsBase64URI: false,
      imagesExtensions: ["jpg", "png", "jpeg", "gif"],
      withCredentials: true,
      pathVariableName: "path",
      filesVariableName: () => "boardImage",
      format: "json",
      method: "POST",
      prepareData: (formdata: FormData) => {
        const maxFileSize = 50 * 1024 * 1024;

        for (let key of formdata.keys() as any) {
          const file = formdata.get(key) as any;
          if (file && file.size >= maxFileSize) {
            formdata.delete(key);
            alert("파일 용량이 50mb를 넘을 수 없습니다.");
          }
        }
        return formdata;
      },
      isSuccess: function (res: IUploaderAnswer) {
        return res;
      },
      process: (res: IUploaderAnswer) => {
        let files = [];
        files.unshift(res.data);

        return {
          files: res.data,
          error: res.data.messages,
          msg: res.data.messages,
        };
      },
      error: (e: Error) => {
        console.error(e);
      },
      defaultHandlerSuccess: (res: IUploaderData) => {
        if (res.files) {
          const formValues = control?._formValues;
          const files = res.files as any[];
          let image = [] as ReactNode[];

          files.forEach(({url}: { url: string }) => {
            image.push(
              `<img src="${url}" style="max-width: 100%" name="boardImg" alt="boardImg"/>`
            );
          });

          setValue(name, (formValues && formValues[name] || '') + image.join(''));
        }
      },
    },
  }), []);

  return (
    <div className="flex flex-col h-full [&_.jodit-react-container]:flex-1 [&_.jodit-container]:flex [&_.jodit-container]:flex-col">
      <Controller
        control={control}
        name={name || ''}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <>
            <JoditEditor value={value} config={config} onBlur={(value) => onChange(value)}/>
            {error && <Danger>{error.message}</Danger>}
          </>
        )}
      />
    </div>
  )
}

export default memo(Editor);
