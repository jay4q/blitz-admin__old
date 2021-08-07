import { FunctionComponent, useCallback, useState } from 'react'
import BraftEditor, { BuiltInControlType, EditorState, ExtendControlType, ImageControlType } from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import 'braft-editor/dist/index.css'
import { getCloudUrl } from '@/utils/cloudbase'
import { EditorUploader } from './EditorUploader'

type Props = {
  value: string
  onChange: (value: string) => void
}

const IMAGE_CONTROLS: ImageControlType[] = ['remove']
const EXCLUDE_CONTROLS: BuiltInControlType[] = ['hr', 'code', 'subscript', 'superscript', 'media', 'fullscreen']

/**
 * @description 富文本编辑器
 * @see https://braft.margox.cn/
 */
export const Editor: FunctionComponent<Props> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState<any>(BraftEditor.createEditorState(value))

  const handleChange = useCallback((state: EditorState) => {
    setEditorState(state)
    onChange(state?.toHTML())
  }, [onChange])

  const extendControls: ExtendControlType[] = [
    {
      key: 'img-uploader',
      type: 'component',
      component: (
        <EditorUploader
          type='image'
          onChange={cloudUrl => {
            const state = ContentUtils.insertMedias(editorState, [
              {
                type: 'IMAGE',
                url: getCloudUrl(cloudUrl),
              },
            ])
            setEditorState(state)
          }}
        />
      ),
    },
    {
      key: 'video-uploader',
      type: 'component',
      component: (
        <EditorUploader
          type='media'
          onChange={cloudUrl => {
            const state = ContentUtils.insertMedias(editorState, [
              {
                type: 'VIDEO',
                url: getCloudUrl(cloudUrl),
              },
            ])
            setEditorState(state)
          }}
        />
      ),
    }
  ]

  return (
    <div className='w-full border border-gray-300'>
      <BraftEditor
        value={editorState}
        onChange={handleChange}
        imageControls={IMAGE_CONTROLS}
        excludeControls={EXCLUDE_CONTROLS}
        extendControls={extendControls}
      />
    </div>
  )
}