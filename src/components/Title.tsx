interface TitleProps {
  text1: string
  text2: string
}

const Title = ({ text1, text2 }: TitleProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <p className="text-gray-600 text-sm font-medium">{text1}</p>
      <p className="w-8 sm:w-12 h-1 sm:h-2 bg-black"></p>
      <p className="text-gray-600 text-sm font-medium">{text2}</p>
    </div>
  )
}

export default Title
