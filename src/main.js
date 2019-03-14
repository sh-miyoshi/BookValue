import { createStackNavigator, createAppContainer } from 'react-navigation'
import SelectImage from './selectImage'
import SelectTitle from './selectTitle'
import BookDetails from './bookDetails'

const RootStack = createStackNavigator(
  {
    SelectImage: {
      screen: SelectImage,
    },
    SelectTitle: {
      screen: SelectTitle,
    },
    BookDetails: {
      screen: BookDetails
    }
  },
  {
    initialRouteName: 'SelectImage',
  }
)

export const AppContainer = createAppContainer(RootStack)