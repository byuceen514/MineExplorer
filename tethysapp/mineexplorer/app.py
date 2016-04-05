from tethys_sdk.base import TethysAppBase, url_map_maker


class Mineexplorer(TethysAppBase):
    """
    Tethys app class for MineExplorer.
    """

    name = 'MineExplorer'
    index = 'mineexplorer:home'
    icon = 'mineexplorer/images/icon.gif'
    package = 'mineexplorer'
    root_url = 'mineexplorer'
    color = '#3498db'
    description = 'Place a brief description of your app here.'
    enable_feedback = False
    feedback_emails = []

        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='mineexplorer',
                           controller='mineexplorer.controllers.home'),
                    UrlMap(name='area',
                           url='area',
                           controller='mineexplorer.controllers.area'),
                    UrlMap(name='user_documentation',
                           url='user_documentation',
                           controller='mineexplorer.controllers.user_documentation'),
                    UrlMap(name='help_file',
                           url='help_file',
                           controller='mineexplorer.controllers.help_file'),
        )

        return url_maps